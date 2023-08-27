import React from 'react';
import SchemaForm from '@/components/SchemaForm';
import { ProFormColumnsType } from '@ant-design/pro-components';
import { IDirectory } from '@/ts/core';
import { XRequest } from '@/ts/base/schema';
import { IRequest } from '@/ts/core/thing/config';
import {} from '@/ts/core/';
import { ConfigColl } from '@/ts/core/thing/directory';
import { generateUuid } from '@/ts/base/common';

interface IProps {
  current: IDirectory;
  finished: (request: IRequest) => void;
  cancel: () => void;
}

const RequestForm: React.FC<IProps> = ({ current, finished, cancel }) => {
  const columns: ProFormColumnsType<XRequest>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<XRequest>
      open
      title="请求配置"
      width={640}
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          cancel();
        }
      }}
      onFinish={async (values) => {
        values.curTab = 'Param';
        values.axios = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        };
        values.headers = Object.entries(values.axios.headers!).map(
          (value: [string, any]) => {
            return {
              id: generateUuid(),
              key: value[0],
              value: value[1],
            };
          },
        );
        let request = await current.createConfig(ConfigColl.Requests, values);
        finished(request as IRequest);
      }}
    />
  );
};

export default RequestForm;
