import React, { useState } from 'react';
import cls from './index.module.less';
import SchemaForm from '@/components/SchemaForm';
import { columns, DataItem, Resources } from './config';
import { Form, Card, Row, Col, Space, PageHeader, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { createProduct } from '@/ts/controller/store/appContent';

const CreatApp: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false); //  是否显示创建应用窗口
  const [createAppForm] = Form.useForm<Record<string, any>>();

  // 提交表单数据
  const handleCreateApp = async (values: DataItem) => {
    // Provider.person.createProduct(values);
    const { resources } = values;
    const list = resources.map((n: Resources) => {
      return {
        ...n,
        components: n?.components ? JSON.stringify(n.components) : null,
        flows: n.flows ? JSON.stringify(n.flows) : null,
      };
    });
    const { success } = await createProduct({ ...values, resources: list });
    if (success) {
      message.success('创建应用成功');
      history.goBack();
    }
  };
  return (
    <Card bordered={false}>
      <PageHeader
        className={cls[`site-page-header`]}
        onBack={() => history.goBack()}
        title="创建应用"
        // subTitle="This is a subtitle"
      />
      <div className={cls.formContent}>
        <SchemaForm<DataItem>
          form={createAppForm}
          layoutType="Form"
          open={showCreateModal}
          title="创建应用"
          onFinish={handleCreateApp}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => setShowCreateModal(false),
          }}
          columns={columns}
          submitter={{
            render: (props, doms) => {
              return (
                <Row>
                  <Col span={20}></Col>
                  <Col span={4}>
                    <Space>{doms}</Space>
                  </Col>
                </Row>
              );
            },
          }}
        />
      </div>
    </Card>
  );
};

export default CreatApp;
