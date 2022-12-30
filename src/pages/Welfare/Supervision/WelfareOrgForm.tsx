import { kernel } from '@/ts/base';
import { Button, Card, Col, DatePicker, Form, Input, message, Row } from 'antd';
import React from 'react';
import { generateUuid } from '@/ts/base/common';
import { WelfareOrgModel } from './WelfareOrgList';

/**
 * 公益组织信息填写表单（必须单位空间）
 */
const WelfareOrgForm: React.FC = () => {
  return (
    <>
      <Card title={'公益集团加入申请'} bordered={false}>
        <Form
          layout="vertical"
          onFinish={(formdata: WelfareOrgModel) => {
            // TODO 按照业务校验表单
            // TODO 补充社会统一信用代码
            console.log('formdata', formdata);
            formdata = { ...formdata, ...{ id: generateUuid(), dataStatus: 1 } };
            kernel.anystore.insert('we_welfareorg', formdata, 'company').then((res) => {
              console.log('res', res);
              if (res.success) {
                // TODO 调用加入集团方法
                message.success('申请成功！');
              } else {
                message.error(res.msg);
              }
            });
          }}>
          <Row gutter={[96, 16]}>
            <Col span={8}>
              <Form.Item name="name" label="组织名称">
                <Input placeholder="请输入组织名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="businessAreas" label="所在领域">
                <Input placeholder="请输入所在领域" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="registerType" label="注册类型">
                <Input placeholder="请输入注册类型" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[96, 16]}>
            <Col span={8}>
              <Form.Item name="code" label="统一社会征信代码">
                <Input placeholder="请输入统一社会征信代码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="registerManageOrgan" label="登记管理机关">
                <Input placeholder="请输入登记管理机关" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="businessManageOrgan" label="业务管理机关">
                <Input placeholder="请输入业务管理机关" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[96, 16]}>
            <Col span={8}>
              <Form.Item name="registerTime" label="注册时间">
                <DatePicker placeholder="请选择注册时间" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="establishTime" label="成立时间">
                <DatePicker placeholder="请选择成立时间" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contactPerson" label="联系人">
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[96, 16]}>
            <Col span={8}>
              <Form.Item name="phone" label="联系方式">
                <Input placeholder="请输入联系方式" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea placeholder="请填写备注" autoSize={true} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default WelfareOrgForm;
