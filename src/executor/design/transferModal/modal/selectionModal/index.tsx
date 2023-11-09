import { ProTable } from '@ant-design/pro-components';
import React from 'react';
import { FullModal } from '../..';
import { model } from '@/ts/base';
import { IForm } from '@/ts/core';

interface IProps {
  form: IForm;
  node: model.Selection;
  data: any[];
  finished: (values?: any) => void;
}

const SelectionModal: React.FC<IProps> = ({ form, data, node, finished }) => {
  return (
    <FullModal title={'选择'} finished={finished} fullScreen={false}>
      <ProTable<any>
        dataSource={data}
        search={false}
        options={false}
        cardProps={{ bodyStyle: { padding: 0 } }}
        scroll={{ y: 300 }}
        rowKey={node.type}
        columns={form.attributes.map((item: any) => {
          return { title: item.name, dataIndex: item.property?.info };
        })}
        tableAlertRender={false}
        rowSelection={{
          type: node.type,
          onChange: (_) => {
            switch (node.type) {
              case 'checkbox':
                break;
              case 'radio':
                break;
            }
          },
        }}
      />
    </FullModal>
  );
};

export { SelectionModal };
