import React from 'react';
import { model, parseAvatar } from '../../../ts/base';
import { Column, Lookup } from 'devextreme-react/data-grid';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { formatSize, generateUuid } from '@/ts/base/common';

export interface ColumnGenerateProps {
  id: string;
  name: string;
  remark: string;
  visible: boolean;
  dataField: string;
  valueType: string;
  lookupSource?: {
    text: string;
    value: string;
  }[];
}

/** 使用form生成表单列 */
export const GenerateColumn = (props: ColumnGenerateProps) => {
  switch (props.valueType) {
    case '时间型':
      return (
        <Column
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
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
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
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
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
          width={200}
          headerFilter={{
            allowSearch: true,
            dataSource: props.lookupSource,
          }}>
          <Lookup dataSource={props.lookupSource} displayExpr="text" valueExpr="value" />
        </Column>
      );
    case '数值型':
      return (
        <Column
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
          fixed={props.id === 'Id'}
          dataType="number"
          width={150}
          allowHeaderFiltering={false}
        />
      );
    case '用户型':
      return (
        <Column
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
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
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
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
        <Column
          key={generateUuid()}
          dataField={props.dataField}
          caption={props.name}
          visible={props.visible}
          dataType="string"
          width={180}
          allowHeaderFiltering={false}
        />
      );
  }
};
