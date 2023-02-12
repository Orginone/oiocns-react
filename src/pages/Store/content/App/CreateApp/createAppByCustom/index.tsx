import React, { useState } from 'react';
import { Form, Card, Row, Col, Space, PageHeader, message, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';

interface Iprops {
  setCreateWay: Function;
}
const CreateAppByCustom: React.FC<Iprops> = (props) => {
  const { setCreateWay } = props;
  return (
    <Card bordered={true}>
      <PageHeader
        onBack={() => {
          setCreateWay(undefined);
        }}
        title="定制需求填报"
      />
      <>
        <div
          style={{
            margin: 24,
          }}>
          <ProForm onFinish={async (values: any) => {}} initialValues={{}}>
            <ProForm.Group>
              <ProFormText
                width="md"
                name="company"
                label="企业名称"
                tooltip="最长为 24 位"
                placeholder="请输入名称"
                required={true}
              />
              <ProFormText
                width="md"
                name="name"
                label="联系人"
                placeholder="请输入联系人"
                required={true}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name={['contract', 'name']}
                width="md"
                label="合同名称"
                placeholder="请输入名称"
              />
              <ProFormDateRangePicker
                width="md"
                name={['contract', 'createTime']}
                label="合同生效时间"
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                options={[{ value: 'chapter', label: '盖章后生效' }]}
                readonly
                width="xs"
                name="useMode"
                label="合同约定生效方式"
              />
              <ProFormSelect
                width="xs"
                options={[{ value: 'time', label: '履行完终止' }]}
                name="unusedMode"
                label="合同约定失效效方式"
              />
            </ProForm.Group>
            <ProFormText width="sm" name="id" label="主合同编号" />
            <ProFormText
              name="project"
              width="md"
              disabled
              label="项目名称"
              initialValue="xxxx项目"
            />
            <ProFormText
              width="xs"
              name="mangerName"
              disabled
              label="商务经理"
              initialValue="启途"
            />
          </ProForm>
        </div>
      </>
    </Card>
  );
};

export default CreateAppByCustom;
