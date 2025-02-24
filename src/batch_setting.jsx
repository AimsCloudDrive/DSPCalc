import structuredClone from "@ungap/structured-clone";
import { useContext, useState } from "react";
import { GlobalStateContext, SchemeDataSetterContext } from "./contexts";
import { HorizontalMultiButtonSelect } from "./recipe.jsx";
import { pro_mode_class } from "./result.jsx";
import { DropDown, ProSelector, getProName, proConfig } from "./define/ProSelector";
import { Avatar } from "antd";

// TODO refactor to some other modules
function FactorySelect({ factory, list }) {
  const global_state = useContext(GlobalStateContext);
  const set_scheme_data = useContext(SchemeDataSetterContext);
  const [cur, set_cur] = useState(0);
  let game_data = global_state.game_data;

  const options = list.map((data, idx) => ({
    value: idx,
    item_icon: data["名称"],
    label: cur == idx ? data["名称"] : null,
  }));

  function set_factory(building) {
    set_cur(building);
    set_scheme_data((old_scheme_data) => {
      let scheme_data = structuredClone(old_scheme_data);
      for (var i = 0; i < game_data.recipe_data.length; i++) {
        if (game_data.recipe_data[i]["设施"] == factory) {
          scheme_data.scheme_for_recipe[i]["建筑"] = building;
        }
      }
      return scheme_data;
    });
  }

  return <HorizontalMultiButtonSelect choice={cur} options={options} onChange={set_factory} no_gap={true} />;
}

export function BatchSetting() {
  const global_state = useContext(GlobalStateContext);
  const set_scheme_data = useContext(SchemeDataSetterContext);
  const [pro_num, set_pro_num] = useState(0);
  const [pro_mode, set_pro_mode] = useState(0);
  let game_data = global_state.game_data;
  let proliferator_price = global_state.proliferator_price;

  let pro_num_item = {};
  for (let data of game_data.proliferator_data) {
    let pro_point = data["增产点数"];
    pro_num_item[pro_point] = pro_point === 0 ? "无" : data["名称"];
  }

  let factory_doms = [];
  // TODO rename to [factory_kind]
  Object.keys(game_data.factory_data).forEach((factory) => {
    let list = game_data.factory_data[factory];
    let used_num = game_data.recipe_data.filter((data) => data["设施"] == factory).length;
    //只有可选工厂类型大于等于2，并且这种工厂类型至少被3个配方使用时，才允许批量预设
    if (list.length >= 2 && used_num >= 3) {
      factory_doms.push(<FactorySelect key={factory} factory={factory} list={list} />);
    }
  });

  let proliferate_options = [];
  game_data.proliferator_effect.forEach((_data, idx) => {
    if (proliferator_price[idx] != -1) {
      let item = pro_num_item[idx];
      if (item) {
        proliferate_options.push({
          value: idx,
          label: idx == 0 ? "无" : null,
          item_icon: idx != 0 ? item : null,
        });
      } else {
        proliferate_options.push({ value: idx, label: idx });
      }
    }
  });

  function change_pro_num(pro_num) {
    set_pro_num(pro_num);
    set_scheme_data((old_scheme_data) => {
      let scheme_data = structuredClone(old_scheme_data);
      for (var i = 0; i < game_data.recipe_data.length; i++) {
        scheme_data.scheme_for_recipe[i]["增产点数"] = pro_num;
      }
      ////////////////// add by lianzt begin
      scheme_data.scheme_for_recipe["增产点数"] = pro_num;
      ////////////////// add by lianzt end
      return scheme_data;
    });
    ////////////////// add by lianzt begin
    if (pro_num == 0) {
      change_pro_mode(0); // 无增产
    } else {
      change_pro_mode(1); // 有增产时先切换到加速
      change_pro_mode(2); // 再切换到增产，某些配方无增产时依然可以保留加速效果
    }
    ////////////////// add by lianzt end
  }

  function change_pro_mode(pro_mode) {
    set_pro_mode(pro_mode);
    set_scheme_data((old_scheme_data) => {
      let scheme_data = structuredClone(old_scheme_data);
      for (var i = 0; i < game_data.recipe_data.length; i++) {
        if (pro_mode != 0 && !(pro_mode & game_data.recipe_data[i]["增产"])) {
          continue;
        }
        scheme_data.scheme_for_recipe[i]["增产模式"] = Number(pro_mode);
      }
      return scheme_data;
    });
  }

  // const promode_options = [
  //   { value: 0, label: "无" },
  //   { value: 1, label: "加速", className: pro_mode_class[1] },
  //   { value: 2, label: "增产", className: pro_mode_class[2] },
  // ];
  const proOptions = [
    { num: 0, mode: 0 },
    { num: 1, mode: 2 },
    { num: 1, mode: 1 },
    { num: 2, mode: 2 },
    { num: 2, mode: 1 },
    { num: 4, mode: 2 },
    { num: 4, mode: 1 },
  ];

  return (
    <div className="mt-3 d-inline-flex flex-wrap column-gap-3 row-gap-2 align-items-center">
      <small className="fw-bold">批量预设</small>
      {/* 增产剂选择 */}
      <DropDown
        options={proOptions}
        title={""}
        selected={{ num: pro_num, mode: pro_mode }}
        trigger={"click"}
        getIcon={(pro) => {
          return (
            <Avatar
              shape={"square"}
              icon={
                <img src={`public/icon/proIcon/${!pro || pro.num === 0 ? "notPro" : `${proConfig.mode[pro.mode].dir}/MK ${proConfig.num[pro.num]}`}.png`}></img>
              }
            />
          );
        }}
        getContent={(pro) => {
          return <div style={{ width: "auto" }}>{getProName(pro)}</div>;
        }}
        showContent={false}
        change={(pro) => {
          if (!pro) {
            pro = { num: 0, mode: 0 };
          }
          change_pro_num(pro.num);
          change_pro_mode(pro.mode);
        }}
      ></DropDown>
      {/* 设备选择 */}
      {factory_doms}
    </div>
  );
}
