import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import SchemaForm from '@/components/SchemaForm';
import { columns, DataItem } from './config';
import { Form, Card } from 'antd';
import { IconFont } from '@/components/IconFont';
import { RouteComponentProps } from 'react-router-dom';

const CreatApp: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false); // 是否显示创建应用窗口
  const [createAppForm] = Form.useForm<Record<string, any>>();
  // 提交表单数据
  const handleCreateApp = (values: any) => {
    // Provider.person.createProduct(values);
    console.log(values);
  };
  return (
    <Card
      title={
        <IconFont
          type="icon-jiantou-left"
          className={cls.RouterBackBtn}
          onClick={() => {
            history.goBack();
          }}
        />
      }>
      <div style={{ width: 750, margin: 'auto' }}>
        <SchemaForm<DataItem>
          form={createAppForm}
          layoutType="Form"
          open={showCreateModal}
          title="创建应用"
          // colProps={{
          //   span: 12,
          // }}
          onFinish={handleCreateApp}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setShowCreateModal(false),
          }}
          columns={columns}
        />
      </div>
    </Card>
  );
};

export default CreatApp;
