import React, { useState } from 'react';
import cls from './index.module.less';
import SchemaForm from '@/components/SchemaForm';
import { columns, DataItem, Resources } from './config';
import { Form, Card, Row, Col, Space, PageHeader, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import userCtrl from '@/ts/controller/setting/userCtrl';
import appCtrl from '@/ts/controller/store/appCtrl';

const CreatApp: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false); //  是否显示创建应用窗口
  const [createAppForm] = Form.useForm<Record<string, any>>();
  const prod = appCtrl.curProduct?.prod;

  // 提交表单数据
  const handleCreateApp = async (values: DataItem) => {
    const { resources } = values;
    const list = resources.map((n: Resources) => {
      return {
        ...n,
        components: n?.components ? JSON.stringify(n.components) : '',
        flows: n.flows ? JSON.stringify(n.flows) : undefined,
      };
    });
    const Fun = prod ? appCtrl.curProduct!.update : userCtrl.space.createProduct;
    const res = await Fun({
      ...values,
      resources: list,
    });

    if (res) {
      message.success(`${prod ? '更新' : '创建'}应用成功`);
      history.push('/store/app');
    }
  };

  // 编辑功能
  if (prod) {
    createAppForm.setFieldsValue({
      id: prod.id,
      name: prod.name,
      code: prod.code,
      remark: prod.remark,
      typeName: prod.typeName,
      resources: prod.resource?.map((item: any) => {
        let obj = {
          id: item.id,
          name: item.name,
          code: item.code,
          link: item.link,
          components: item.components && JSON.parse(item.components),
          flows: item.flows && JSON.parse(item.flows),
        };
        return obj;
      }),
    });
  }
  return (
    <Card bordered={false}>
      <PageHeader
        className={cls[`site-page-header`]}
        onBack={() => history.goBack()}
        title={`${appCtrl.curProduct ? '更新' : '创建'}应用`}
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

export default CreatApp;
