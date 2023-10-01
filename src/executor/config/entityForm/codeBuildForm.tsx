import SchemaForm from '@/components/SchemaForm';
import { codeBuildType } from '@/ts/base/model';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import KernelApi from '@/ts/base/api/kernelapi';
export const kernel = KernelApi.getInstance();

interface IProps {
  formType: string;
  current: {};
  finished: () => void;
}

const CodeBuildForm: React.FC<IProps> = ({ formType, current, finished }) => {
  let initialValue = {};
  switch (formType) {
    case 'codeBuildForm':
      initialValue = current;
      break;
  }
  const columns: ProFormColumnsType<codeBuildType>[] = [
    {
      title: '地址',
      dataIndex: 'git',
      colProps: { span: 24 },
      formItemProps() {
        return {
          rules: [
            {
              required: true,
              message: 'git地址，需要以git://开头',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value) {
                  if (getFieldValue('git') === value) {
                    if (value.slice(0, 6) === 'git://') {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('git地址，需要以git://开头'));
                    }
                  }
                }
                return Promise.reject(new Error(''));
              },
            }),
          ],
        };
      },
      fieldProps: {
        placeholder: 'git地址，需要以git://开头',
      },
    },
    {
      title: '相对位置和名称',
      dataIndex: 'dockerfile',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'dockerfile在git项目中的相对位置和名称，一般为Dockerfile',
          },
        ],
      },
      fieldProps: {
        placeholder: 'dockerfile在git项目中的相对位置和名称，一般为Dockerfile',
      },
    },
    {
      title: '镜像名称',
      dataIndex: 'image',
      formItemProps: {
        rules: [{ required: true, message: '构建的镜像名称' }],
      },
      fieldProps: {
        placeholder: '构建的镜像名称',
      },
    },
    {
      title: '用户名密码',
      dataIndex: 'registry_token',
      colProps: { span: 24 },
      formItemProps() {
        return {
          rules: [
            {
              required: true,
              message: '格式：username:password',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value) {
                  if (getFieldValue('registry_token') === value) {
                    if (value.split(':').length > 1) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('格式：username:password'));
                    }
                  }
                }
                return Promise.reject(new Error(''));
              },
            }),
          ],
        };
      },
      fieldProps: {
        placeholder: '格式：username:password',
      },
    },
  ];
  return (
    <SchemaForm<codeBuildType>
      open
      title="代码构建"
      width={640}
      columns={columns}
      initialValues={initialValue}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished();
        }
      }}
      onFinish={async (values) => {
        kernel.codeBuild(values);
        finished();
      }}
    />
  );
};

export default CodeBuildForm;
