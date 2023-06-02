import { XForm, XProperty } from '@/ts/base/schema';
import { ProColumns, ProSchemaValueEnumObj } from '@ant-design/pro-components';
import React, { ReactNode } from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { debounce } from '@/utils/tools';
import { ColTypes } from './const';

// 获取表头配置
const getColItem = (
  col: {
    attrId: string;
    valueEnum: Object | undefined;
  } & XProperty,
) => {
  // 使用属性Id 展示表格
  const { id, attrId, name, valueType = '描述型', valueEnum = undefined } = col;

  let ColItem: ProColumns<any> = {
    title: name,
    key: id,
    dataIndex: attrId ?? id,
    valueType: ColTypes.get(valueType) as 'text',
    valueEnum: valueEnum as ProSchemaValueEnumObj,
    render(text: any, _record: any) {
      if (_record?.EDIT_INFO?.[attrId]) {
        return (
          <span style={{ color: '#154ad8' }} title={`修改前：${text}`}>
            {_record?.EDIT_INFO?.[attrId]}
          </span>
        );
      }
      return <>{text}</>;
    },
  };

  switch (valueType) {
    case '用户型':
      {
        ColItem.render = (text: ReactNode, _record: any) => {
          if (_record) {
            let share = orgCtrl.user?.findShareById(_record[attrId ?? id]);
            return (
              <>
                <TeamIcon share={share} size={15} />
                <span style={{ marginLeft: 10 }}>{share.name}</span>
              </>
            );
          }
          return <span>-</span>;
        };
      }
      break;
    case '选择型':
      break;

    default:
      break;
  }
  return ColItem;
};
/* 生成属性id转对象 特性id 映射 Map */
const MakePropertysToAttrMap = (propertys: any[]) => {
  const PtyToAttrId: Map<string, string> = new Map([]);
  propertys.forEach((proper) => {
    PtyToAttrId.set(proper.id, proper.attrId);
  });
  return PtyToAttrId;
};
/* 弹出编辑数据 */
const submitCurrentTableData = debounce(
  (form: XForm, thingList: any[], propertys: any[], callback: Function) => {
    // 删除 操作一栏
    const JsonData = {
      data: thingList,
      propertys: propertys,
      form: form,
    };
    callback && callback(form.id, thingList, JSON.stringify(JsonData));
  },
  100,
);
/* 属性对象转 特性对象 */
const handlePropToAttrObj = (Ptyrows: any[], hasIds: string[], propertys: any[]) => {
  const keyMap: Map<string, string> = MakePropertysToAttrMap(propertys);
  // 判断是否 已选择存在
  return Ptyrows.filter((s: { Id: string }) => !hasIds.includes(s.Id)).map(
    (item: any) => {
      let obj: { [key: string]: any } = {};
      const { Propertys = {}, ...rest } = item;
      Object.keys(Propertys).forEach((key) => {
        const _key = key.slice(1);
        keyMap.has(_key) && (obj[keyMap.get(_key)!] = item.Propertys[key]);
      });
      return { ...rest, ...obj };
    },
  );
};
export {
  getColItem,
  handlePropToAttrObj,
  MakePropertysToAttrMap,
  submitCurrentTableData,
};
