import SchemaForm from '@/components/SchemaForm';
import { XEnvironment } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core';
import {} from '@/ts/core/';
import { IEnvironment } from '@/ts/core/thing/config';
import { ConfigColl } from '@/ts/core/thing/directory';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React, { useState } from 'react';
import EditableTable from '../transferModal/apiEditor/parts/request/widgets/editable';
import { generateUuid } from '@/ts/base/common';

interface IProps {
  formType: string;
  current: IDirectory | IEnvironment;
  finished: (environment?: IEnvironment) => void;
}

interface Kv {
  id: string;
  k?: string;
  v?: string;
}

const EnvironmentForm: React.FC<IProps> = ({ formType, current, finished }) => {
  let initialValue = {};
  switch (formType) {
    case 'updateEnvironment':
      initialValue = current.metadata;
      break;
  }
  const temp: Kv[] = [];
  if (current.typeName == '环境') {
    const environment = current as IEnvironment;
    const kvs = environment.metadata.kvs;
    temp.push(
      ...Object.entries(kvs).map((value) => {
        return {
          id: generateUuid(),
          k: value[0],
          v: value[1],
        };
      }),
    );
  }
  const [kvs, setKvs] = useState<readonly Kv[]>(temp);
  const columns: ProFormColumnsType<XEnvironment>[] = [
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
                    onClick={() =>
                      setKvs(kvs.filter((item) => item.id != record.id))
                    }>
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
    <SchemaForm<XEnvironment>
      open
      title="环境定义"
      width={800}
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      initialValues={initialValue}
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        values.typeName = '环境';
        values.kvs = {};
        kvs.filter((item) => item.k).forEach((item) => (values.kvs[item.k!] = item.v));
        switch (formType) {
          case 'newEnvironment': {
            let directory = current as IDirectory;
            let environment = await directory.createConfig(
              ConfigColl.Environments,
              values,
            );
            finished(environment as IEnvironment);
            break;
          }
          case 'updateEnvironment': {
            let environment = current as IEnvironment;
            await environment.refresh({ ...initialValue, ...values });
            finished(environment);
            break;
          }
        }
      }}
    />
  );
};

export default EnvironmentForm;
