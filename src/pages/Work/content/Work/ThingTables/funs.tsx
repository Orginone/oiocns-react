import { XProperty } from '@/ts/base/schema';
import { ProColumns, ProSchemaValueEnumObj } from '@ant-design/pro-components';
import React, { ReactNode } from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { debounce } from '@/utils/tools';
import { ColTypes, defaultCol } from './config';

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
) => {
  const { id, attrId, name, valueType = '描述型', valueEnum = undefined } = col;
  const width = name.length * 30 > 80 ? name.length * 30 : 80;

  let ColItem: ProColumns<any> = {
    title: name,
    key: id,
    dataIndex: attrId ?? id,
    width: width,
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
          if (text) {
            let share = orgCtrl.user.findShareById(text as string);

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
/* 弹出编辑数据 */
const submitCurrentTableData = debounce(
  (formId: string, thingList: any[], propertys: any[], callback: Function) => {
    // 删除 操作一栏
    const JsonData = {
      data: thingList,
      columns: [...defaultCol, ...propertys],
    };

    callback && callback(formId, thingList, JSON.stringify(JsonData));
  },
  100,
);
export { getColItem, submitCurrentTableData };
