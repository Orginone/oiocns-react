import React from 'react';
import { model, parseAvatar } from '../../../ts/base';
import { Column, Lookup } from 'devextreme-react/data-grid';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { formatSize, generateUuid } from '@/ts/base/common';

/** 使用form生成表单列 */
export const GenerateColumn = (
  field: model.FieldModel,
  hideColumns: string[] | undefined,
  dataIndex: 'attribute' | 'property' | undefined,
) => {
  const props = {
    key: generateUuid(),
    caption: field.name,
    visible: !hideColumns?.includes(field.id),
    dataField: dataIndex === 'attribute' ? field.id : field.code,
  };
  switch (field.valueType) {
    case '时间型':
      return (
        <Column
          {...props}
          dataType="datetime"
          width={250}
          headerFilter={{
            groupInterval: 'day',
          }}
          format="yyyy年MM月dd日 HH:mm:ss"
        />
      );
    case '日期型':
      return (
        <Column
          {...props}
          dataType="date"
          width={180}
          headerFilter={{
            groupInterval: 'day',
          }}
          format="yyyy年MM月dd日"
        />
      );
    case '选择型':
    case '分类型':
      return (
        <Column
          {...props}
          width={200}
          headerFilter={{
            allowSearch: true,
            dataSource: field.lookups,
          }}>
          <Lookup dataSource={field.lookups} displayExpr="text" valueExpr="value" />
        </Column>
      );
    case '数值型':
      return (
        <Column
          {...props}
          fixed={field.id === 'Id'}
          dataType="number"
          width={150}
          allowHeaderFiltering={false}
        />
      );
    case '用户型':
      return (
        <Column
          {...props}
          dataType="string"
          width={150}
          allowFiltering={false}
          cellRender={(data: any) => {
            return <EntityIcon entityId={data.value} size={15} showName />;
          }}
        />
      );
    case '附件型':
      return (
        <Column
          {...props}
          dataType="string"
          width={150}
          allowFiltering={false}
          cellRender={(data: any) => {
            const shares = parseAvatar(data.value);
            if (shares) {
              return shares.map((share: model.FileItemShare, i: number) => {
                return <div key={i}>{`${share.name}(${formatSize(share.size)})`}</div>;
              });
            }
            return '';
          }}
        />
      );
    default:
      return (
        <Column {...props} dataType="string" width={180} allowHeaderFiltering={false} />
      );
  }
};
