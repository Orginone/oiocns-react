import React, { useState } from 'react';
import cls from './index.module.less';
import SchemaForm from '@/components/SchemaForm';
import { columns, DataItem, Resources } from './config';
import { Form, Card, Row, Col, Space, PageHeader, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import orgCtrl from '@/ts/controller';

const CreateApp: React.FC<RouteComponentProps> = (props) => {
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
        components: n?.components ? JSON.stringify(n.components) : '',
        flows: n.flows ? JSON.stringify(n.flows) : undefined,
      };
    });
    const res = await orgCtrl.space.createProduct({
      ...values,
      photo: '',
      resources: list,
    });
    if (res) {
      message.success('创建应用成功');
      history.goBack();
    }
  };
  return (
    <Card bordered={true}>
      <PageHeader
        className={cls[`site-page-header`]}
        onBack={() => history.goBack()}
        title="创建应用Beta"
        // subTitle="This is a subtitle"
      />
      <div className={cls.formContent}>
        <SchemaForm<DataItem>
          form={createAppForm}
          layoutType="Form"
          open={showCreateModal}
          title="创建应用"
          onFinish={handleCreateApp}
          modalprops={{
            destroyOnClose: true,
            onCancel: () => setShowCreateModal(false),
          }}
          columns={columns}
          submitter={{
            render: (_: any, doms: any) => {
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

export default CreateApp;
