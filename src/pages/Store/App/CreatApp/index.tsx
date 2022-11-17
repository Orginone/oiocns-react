import React from 'react';
// import cls from './index.module.less';
import type { ProFormLayoutType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { columns, DataItem } from './config';
import Provider from '@/ts/core/provider';
interface indexType {
  layoutType: ProFormLayoutType; //props
  open: boolean;
  form: any;
  [key: string]: any;
}
const Index = ({ layoutType, open, form, ...otherConfig }: indexType) => {
  // 提交表单数据
  const handleCreateApp = (values: any) => {
    // Provider.getPerson().createCompany();
  };
  return (
    <>
      <SchemaForm<DataItem>
        form={form}
        layoutType={layoutType}
        open={open}
        colProps={{
          span: 12,
        }}
        onFinish={handleCreateApp}
        columns={columns}
        {...otherConfig}
      />
    </>
  );
};

export default Index;
