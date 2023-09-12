import SchemaForm from '@/components/SchemaForm';
import { model } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React, { useState } from 'react';
import EditableTable from '../../apiEditor/parts/request/widgets/editable';
import { ITransfer } from '@/ts/core';

interface IProps {
  formType: string;
  link: ITransfer;
  current?: model.Environment;
  finished: () => void;
}

interface Kv {
  id: string;
  k?: string;
  v?: string;
}

const EnvironmentForm: React.FC<IProps> = ({ formType, link, current, finished }) => {
  const [kvs, setKvs] = useState<readonly Kv[]>([
    ...Object.entries(current?.params ?? []).map((value) => {
      return {
        id: generateUuid(),
        k: value[0],
        v: value[1],
      };
    }),
  ]);
  const columns: ProFormColumnsType<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'params',
      valueType: 'textarea',
      colProps: { span: 24 },
      initialValue: kvs,
      renderFormItem: () => {
        return (
          <EditableTable<Kv>
            columns={[
              {
                title: '键',
                dataIndex: 'k',
              },
              {
                title: '值',
                dataIndex: 'v',
              },
              {
                title: '操作',
                dataIndex: 'operate',
                editable: false,
                width: 80,
                render: (_, record) => [
                  <a
                    key="delete"
                    onClick={() => setKvs(kvs.filter((item) => item.id != record.id))}>
                    删除
                  </a>,
                ],
              },
            ]}
            value={kvs}
            onChange={(values) => setKvs(values)}
          />
        );
      },
    },
  ];
  return (
    <SchemaForm<model.Environment>
      open
      title="环境定义"
      width={800}
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      initialValues={current}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        kvs.filter((item) => item.k).forEach((item) => (values.params[item.k!] = item.v));
        switch (formType) {
          case 'newEnvironment':
            await link.addEnv(values);
            break;
          case 'updateEnvironment':
            await link.updEnv({ ...current, ...values });
            break;
        }
        finished();
      }}
    />
  );
};

export { EnvironmentForm };
