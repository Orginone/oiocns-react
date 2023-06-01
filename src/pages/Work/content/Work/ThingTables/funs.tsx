import { XForm, XProperty } from '@/ts/base/schema';
import { ProColumns, ProSchemaValueEnumObj } from '@ant-design/pro-components';
import React, { ReactNode } from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { debounce } from '@/utils/tools';
import { ColTypes } from './config';

/*  // columns.push(
      // getColumn(
      //   p.id,
      //   p.name,
      //   p.valueType,
      //   `Propertys.${p.code}`,
      //   p.dict?.dictItems || [],
      // ),
      // );
 */

// 获取表头配置
const getColItem = (
  col: {
    attrId: string;
    valueEnum: Object | undefined;
  } & XProperty,
  colKey: 'propertyId' | 'attrId' = 'propertyId',
) => {
  // 使用属性Id 展示表格
  const { id, attrId, code, name, valueType = '描述型', valueEnum = undefined } = col;
  const width = name.length * 30 > 80 ? name.length * 30 : 80;

  let ColItem: ProColumns<any> = {
    title: name,
    key: id,
    dataIndex: (colKey === 'attrId' ? attrId : id) ?? id,
    width: width,
    valueType: ColTypes.get(valueType) as 'text',
    valueEnum: valueEnum as ProSchemaValueEnumObj,
    render(text: any, _record: any) {
      const _key = colKey === 'attrId' ? attrId : id;

      if (_key && _record?.EDIT_INFO?.[_key]) {
        return (
          <span style={{ color: '#154ad8' }} title={`修改前：${text}`}>
            {_record?.EDIT_INFO?.[_key]}
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
          if (text) {
            let share = orgCtrl.user?.findShareById(text as string);

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
export { getColItem, MakePropertysToAttrMap, submitCurrentTableData };
