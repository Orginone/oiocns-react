import React from 'react';
import { command, model, parseAvatar, schema } from '../../../ts/base';
import { Column, IColumnProps } from 'devextreme-react/data-grid';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { generateUuid } from '@/ts/base/common';
import { ellipsisText, formatDate } from '@/utils';
import { Button } from 'antd';

/** 使用form生成表单列 */
export const GenerateColumn = (
  field: model.FieldModel,
  beforeSource: schema.XThing[] | undefined,
  dataIndex: 'attribute' | 'property' | undefined,
) => {
  const props: IColumnProps = {
    caption: field.name,
    fixedPosition: 'left',
    fixed: field.options?.fixed === true,
    visible: field.options?.visible === true,
    dataField: dataIndex === 'attribute' ? field.id : field.code,
  };
  const cellRender: any = {};
  switch (field.valueType) {
    case '时间型':
      props.dataType = 'datetime';
      props.width = 200;
      props.headerFilter = {
        groupInterval: 'day',
      };
      props.allowHeaderFiltering = false;
      props.format = 'yyyy年MM月dd日 HH:mm:ss';
      cellRender.calcText = (value: string) => {
        return formatDate(new Date(value), 'yyyy年MM月dd日 HH:mm:ss');
      };
      break;
    case '日期型':
      props.dataType = 'date';
      props.width = 180;
      props.headerFilter = {
        groupInterval: 'day',
      };
      props.allowHeaderFiltering = false;
      props.format = 'yyyy年MM月dd日';
      cellRender.calcText = (value: string) => {
        return formatDate(new Date(value), 'yyyy年MM月dd日');
      };
      break;
    case '选择型':
    case '分类型':
      props.width = 200;
      props.headerFilter = {
        allowSearch: true,
        dataSource: field.lookups,
      };
      props.lookup = {
        dataSource: field.lookups,
        displayExpr: 'text',
        valueExpr: 'value',
      };
      cellRender.calcText = (value: string) => {
        return (field.lookups || []).find((i) => i.value === value)?.text || value;
      };
      break;
    case '数值型':
      props.dataType = 'number';
      props.width = 150;
      props.allowHeaderFiltering = false;
      props.fixed = field.id === 'id';
      break;
    case '用户型':
      props.dataType = 'string';
      props.width = 150;
      props.allowFiltering = false;
      cellRender.render = (data: any) => {
        return <EntityIcon entityId={data.value} size={14} showName />;
      };
      break;
    case '附件型':
      props.dataType = 'string';
      props.width = 150;
      props.allowFiltering = false;
      cellRender.render = (data: any) => {
        const shares = parseAvatar(data.value);
        if (shares) {
          return shares.map((share: model.FileItemShare, i: number) => {
            return (
              <Button
                type="link"
                key={i}
                title={share.name}
                onClick={() => {
                  command.emitter('executor', 'open', share, 'preview');
                }}>
                {ellipsisText(share.name, 10)}
              </Button>
            );
          });
        }
        return '';
      };
      break;
    default:
      props.dataType = 'string';
      props.width = 180;
      props.allowHeaderFiltering = false;
      break;
  }
  if (beforeSource && beforeSource.length > 0) {
    props.cellRender = (data: any) => {
      const text = cellRender.render ? cellRender.render(data) : data.text;
      if (data?.data?.id && data?.column?.dataField) {
        const before = beforeSource.find((i) => i.id === data.data.id);
        if (before) {
          const beforeValue = before[data.column.dataField];
          if (beforeValue != data.value) {
            const beforeText = cellRender.calcText
              ? cellRender.calcText(beforeValue)
              : beforeValue;
            return (
              <span>
                <span style={{ marginRight: 6 }}>{beforeText}</span>
                <a>{text}</a>
              </span>
            );
          }
        }
      }
      return text;
    };
  } else {
    if (cellRender.render) {
      props.cellRender = cellRender.render;
    }
  }
  return <Column key={generateUuid()} {...props} />;
};
