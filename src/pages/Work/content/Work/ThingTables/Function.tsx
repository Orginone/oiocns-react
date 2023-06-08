import { XForm, XProperty } from '@/ts/base/schema';
import { Image } from 'antd';
import { ProColumns, ProSchemaValueEnumObj } from '@ant-design/pro-components';
import React, { ReactNode } from 'react';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { debounce } from '@/utils/tools';
import { ColTypes } from './const';
import { FileItemShare } from '@/ts/base/model';

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
          <span style={{ color: '#154ad8' }} title={`修改前：${_record[attrId] ?? '-'}`}>
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
        ColItem.render = (_text: ReactNode, _record: any) => {
          if (_record) {
            return <TeamIcon entityId={_record[attrId ?? id]} size={15} showName />;
          }
          return <span>-</span>;
        };
      }
      break;
    case '选择型':
      break;
    case '附件型':
      {
        ColItem.render = (_text: ReactNode, _record: any) => {
          if (_record) {
            try {
              _record.EDIT_INFO = _record.EDIT_INFO || {};
              const value =
                _record.EDIT_INFO[attrId ?? id] || _record[attrId ?? id] || '[]';
              let shares: FileItemShare[] = JSON.parse(value);
              return shares.map((a) => (
                <Image key={a.name} src={a.thumbnail} preview={{ src: a.shareLink }} />
              ));
            } catch {
              return <span>-</span>;
            }
          }
          return <span>-</span>;
        };
      }
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
  300,
);
/* 属性对象转 特性对象 */
const handlePropToAttrObj = (PropertysDatas: any[], keyMap: Map<string, string>) => {
  // const keyMap: Map<string, string> = MakePropertysToAttrMap(propertys);
  // 判断是否 已选择存在
  return PropertysDatas.map((item: any) => {
    let obj: { [key: string]: any } = {};
    const { Propertys = {}, ...rest } = item;
    Object.keys(Propertys).forEach((key) => {
      const _key = key.slice(1);
      obj[keyMap.has(_key) ? keyMap.get(_key)! : `S${key}`] = Propertys[key];
    });
    return { ...rest, ...obj };
  });
};
export {
  getColItem,
  handlePropToAttrObj,
  MakePropertysToAttrMap,
  submitCurrentTableData,
};
