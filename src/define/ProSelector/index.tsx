import React from "react";
import { Dropdown, MenuProps, Space, Avatar, DropDownProps, Input } from "antd";
import { Nullable } from "@ocean/common";
export interface Pro {
  num: number;
  mode: number;
}

export const proConfig = {
  num: {
    1: "Ⅰ",
    2: "Ⅱ",
    4: "Ⅲ",
  },
  mode: {
    0: { dir: "", label: "" },
    1: { dir: "speed", label: "生产加速" },
    2: { dir: "products", label: "额外产出" },
  },
};

type ProSelectorProps = { selected?: Pro | null; update: (pro: Pro | null) => void };
export function getProName(pro?: Pro | null) {
  return !pro || pro.num === 0 ? "无" : `增产剂MK ${proConfig.num[pro.num]}（${proConfig.mode[pro.mode].label}）`;
}

export const ProSelector: React.FC<ProSelectorProps> = ({ selected, update }) => {
  function getLabel(pro: Pro | null) {
    return (
      <Space
        direction={"horizontal"}
        onClick={() => {
          update(pro);
        }}
        style={{
          width: "100%",
        }}
      >
        <Avatar
          shape={"square"}
          icon={
            <img src={`public/icon/proIcon/${!pro || pro.num === 0 ? "notPro" : `${proConfig.mode[pro.mode].dir}/MK ${proConfig.num[pro.num]}`}.png`}></img>
          }
        />
        <div style={{ width: "auto" }}>{getProName(pro)}</div>
      </Space>
    );
  }

  const proOptions: MenuProps["items"] = [
    { key: "0-0", label: getLabel({ num: 0, mode: 0 }) },
    {
      key: "1-2",
      label: getLabel({ num: 1, mode: 2 }),
    },
    {
      key: "1-1",
      label: getLabel({ num: 1, mode: 1 }),
    },
    {
      key: "2-2",
      label: getLabel({ num: 2, mode: 2 }),
    },
    {
      key: "2-1",
      label: getLabel({ num: 2, mode: 1 }),
    },
    {
      key: "4-2",
      label: getLabel({ num: 4, mode: 2 }),
    },
    {
      key: "4-1",
      label: getLabel({ num: 4, mode: 1 }),
    },
  ];

  return (
    <Space direction={"horizontal"}>
      {"增产剂："}
      <Dropdown menu={{ items: proOptions }} trigger={["click"]}>
        <Space>
          <Avatar
            shape={"square"}
            icon={
              <img
                src={`public/icon/proIcon/${
                  !selected || selected.num === 0 ? "notPro" : `${proConfig.mode[selected.mode].dir}/MK ${proConfig.num[selected.num]}`
                }.png`}
              ></img>
            }
          ></Avatar>
        </Space>
      </Dropdown>
    </Space>
  );
};

type AnyObject = Record<string | number | symbol, any>;
type Reference = {
  nativeElement: HTMLDivElement;
  scrollTo: (config: ScrollConfig) => void;
};
type ScrollConfig = {
  index?: number;
  key?: React.Key;
  top?: number;
};

type _DropDownProps<P extends AnyObject> = Exclude<DropDownProps, "items"> & {
  title?: React.ReactNode;
  options: P[];
  selected?: P | Nullable;
  getIcon?: (option: P) => React.ReactNode;
  getContent?: (option: P) => React.ReactNode;
  showContent?: boolean;
  change?: (option: P) => void;
};
const _DropDown: (<RecordType extends AnyObject = AnyObject>(
  props: _DropDownProps<RecordType> & {
    children?: React.ReactNode;
  } & React.RefAttributes<Reference>
) => React.ReactNode) &
  React.FC<_DropDownProps<any>> = <RecordType extends AnyObject = AnyObject>(props: _DropDownProps<RecordType>) => {
  const { title, options = [], getContent, getIcon, change, selected, showContent = false, ...dropProps } = props;
  const items: MenuProps["items"] = options.map((option, index) => {
    return {
      key: index,
      label: (
        <>
          <Space
            style={{
              width: "100%",
            }}
            direction={"horizontal"}
            onClick={() => {
              change?.(option);
            }}
          >
            {getIcon?.(option) || <></>}
            {getContent?.(option) || <></>}
          </Space>
        </>
      ),
    };
  });
  return (
    <Space direction={"horizontal"}>
      {title}
      <Dropdown menu={{ items }} {...dropProps}>
        <Space direction={"horizontal"}>
          {(!getIcon && !getContent) || !selected ? <Input /> : [getIcon?.(selected), showContent && getContent?.(selected)]}
        </Space>
      </Dropdown>
    </Space>
  );
};

export { _DropDown as DropDown };
