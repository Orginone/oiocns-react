import SchemaForm from '@/components/SchemaForm';
import { XExecutable } from '@/ts/base/schema';
import { IDirectory } from '@/ts/core';
import {} from '@/ts/core/';
import { IExecutable } from '@/ts/core/thing/config';
import { ConfigColl } from '@/ts/core/thing/directory';
import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import MonacoEditor from '../transferModal/apiEditor/parts/monacor';
import { Space } from 'antd';

interface IProps {
  formType: string;
  current: IDirectory | IExecutable;
  finished: (executable?: IExecutable) => void;
}

const ExecutableForm: React.FC<IProps> = ({ formType, current, finished }) => {
  let initialValue = {};
  switch (formType) {
    case 'updateExecutable':
      initialValue = current.metadata;
      break;
  }
  const columns: ProFormColumnsType<XExecutable>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '脚本',
      dataIndex: 'coder',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <Space style={{ width: '100%' }} direction="vertical">
            <div style={{ color: 'red' }}>
              1. 提供一个沙盒运行环境，不能访问 document、console、windows 等浏览器变量;
              <br />
              2. 脚本执行的上下文中只有 environment, curData, preData, nextData 四个参数可以使用;
              <br />
              3. preData 包含上一个节点运行返回的值，可能为空，可能为 AxiosResponse, 可能为上一个脚本返回的值;
              <br />
              4. 案例 1, 解析请求并设置环境变量: environment['accessToken'] = preData.data.data.accessToken;
              <br />
              5. 案例 2, 解析请求并设置下个节点变量: nextData['array'] = preData.data.data.records;
            </div>
            <MonacoEditor
              height={400}
              defaultLanguage="javascript"
              defaultValue={form.getFieldValue('coder')}
              onChange={(value) => form.setFieldValue('coder', value)}
            />
          </Space>
        );
      },
    },
  ];
  return (
    <SchemaForm<XExecutable>
      open
      title="脚本配置"
      width={1000}
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
        switch (formType) {
          case 'newExecutable':
            const dir = current as IDirectory;
            values.typeName = "脚本";
            let executable = await dir.createConfig(ConfigColl.Scripts, values);
            finished(executable as IExecutable);
            break;
          case 'updateExecutable':
            const exec = current as IExecutable;
            await exec.refresh({ ...initialValue, ...values });
            finished(exec);
            break;
        }
      }}
    />
  );
};

export default ExecutableForm;
