import { ProFormColumnsType } from '@ant-design/pro-components';
import React from 'react';
import MonacoEditor from '../../apiEditor/parts/monacor';
import { Space } from 'antd';
import { ILink, Pos } from '@/ts/core/thing/link';
import { model } from '@/ts/base';
import SchemaForm from '@/components/SchemaForm';

interface IProps {
  formType: string;
  link: ILink;
  node: model.Node<any>;
  pos: Pos;
  current?: model.Script;
  finished: (code?: string) => void;
}

const ScriptForm: React.FC<IProps> = ({
  formType,
  link,
  pos,
  node,
  current,
  finished,
}) => {
  const columns: ProFormColumnsType<model.Script>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '脚本',
      dataIndex: 'code',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <Space style={{ width: '100%' }} direction="vertical">
            <div style={{ color: 'red' }}>
              1. 提供一个沙盒运行环境，不能访问 document、console、windows 等浏览器变量;
              <br />
              2. 脚本执行的上下文中只有 environment, preData, nextData 三个参数可以使用;
              <br />
              3. preData 包含上一个节点运行返回的值，可能为空，可能为 AxiosResponse,
              可能为上一个脚本返回的值;
              <br />
              4. 案例 1, 解析请求并设置环境变量: environment['accessToken'] =
              preData.data.data.accessToken;
              <br />
              5. 案例 2, 解析请求并设置下个节点变量: nextData['array'] =
              preData.data.data.records;
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
    <SchemaForm<model.Script>
      open
      title="脚本配置"
      width={1000}
      columns={columns}
      initialValues={current}
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
          case 'newScript':
            await link.addNodeScript(pos, node, values);
            break;
          case 'updateScript':
            await link.updNodeScript(pos, node, { ...current, ...values });
            break;
        }
        finished();
      }}
    />
  );
};

export { ScriptForm };
