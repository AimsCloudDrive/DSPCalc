import React from "react";
import { ItemIcon } from "../../icon";
import { Trash } from "react-bootstrap-icons";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { InputNumber } from "antd";

export type RequireListProps = { list: Record<string, number>; updateList: (list: Record<string, number>) => void };

type ListType = { name: string; count: number };

const getColumns: (dataSource: ListType[], update: (dataSource: ListType[]) => void) => TableProps<ListType>["columns"] = (dataSource, update) => [
  { title: "目标物品", dataIndex: "name", render: (data) => <ItemIcon item={data} /> },
  {
    title: "物品/分",
    dataIndex: "count",
    render: (data, _, index) => (
      <InputNumber
        min={0}
        step={1}
        value={Number.parseInt(data) || 0}
        onChange={(value) => {
          if (Number.isNaN(value) || value == null) {
            return;
          } else {
            update(dataSource.map((item, i) => (i === index ? { ...item, count: Math.ceil(value) } : item)));
          }
        }}
      />
    ),
  },
  {
    title: "操作",
    render: (_, __, index) => (
      <button
        className="btn btn-outline-danger d-inline-flex align-items-center"
        onClick={() => {
          update(dataSource.filter((_, i) => i !== index));
        }}
      >
        <Trash />
      </button>
    ),
  },
];

function toDataSource(list: RequireListProps["list"]): ListType[] {
  return Object.entries(list).map(([name, count]) => ({ name, count }));
}
function toList(dataSource: ListType[]): RequireListProps["list"] {
  return dataSource.reduce((acc, { name, count }) => {
    acc[name] = count;
    return acc;
  }, {} as RequireListProps["list"]);
}

export const RequireList = ({ list, updateList }: RequireListProps) => {
  if (Object.keys(list).length === 0) {
    return null;
  }
  const dataSource = toDataSource(list);
  return (
    <Table<ListType>
      columns={getColumns(dataSource, (dataSource) => {
        updateList(toList(dataSource));
      })}
      dataSource={dataSource}
    ></Table>
  );
};

type RequireItemProps = { name: string; count: number; updateItem: (count: number, remove: boolean) => void };

const RequireItem: React.FC<RequireItemProps> = ({ name, count, updateItem }) => {
  return (
    <div key={name} className="d-inline-flex align-items-center">
      {/* 物品图标 */}
      <ItemIcon item={name} />
      <span className="ms-1 me-2">x</span>
      <div key={name} className="input-group input-group-sm w-fit d-inline-flex">
        <input
          type="text"
          className="form-control"
          style={{ width: "6em" }}
          value={count}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (Number.isNaN(value)) {
              return;
            } else {
              updateItem(value, false);
            }
          }}
        />
        <button
          className="btn btn-outline-danger d-inline-flex align-items-center"
          onClick={() => {
            updateItem(0, true);
          }}
        >
          <Trash />
        </button>
      </div>
    </div>
  );
};
