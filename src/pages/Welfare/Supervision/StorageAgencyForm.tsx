import { kernel } from '@/ts/base';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
} from 'antd';
import React from 'react';
import { generateUuid } from '@/ts/base/common';

/**
 * 仓储机构信息填写表单（必须单位空间）
 */
const StorageAgencyForm: React.FC = () => {
  return (
    <>
      <Card title={'公益仓储加入申请'} bordered={false}>
        <Form
          layout="vertical"
          onFinish={(formdata) => {
            // TODO 按照业务校验表单
            // TODO 补充社会统一信用代码
            console.log('formdata', formdata);
            formdata = { ...formdata, ...{ id: generateUuid(), dataStatus: 1 } };
            kernel.anystore
              .insert('we_storageagency', formdata, 'company')
              .then((res) => {
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
              <Form.Item name="name" label="仓储名称">
                <Input placeholder="请输入仓储名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="provincialCity" label="所在区域">
                <Input placeholder="请输入所在区域" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="address" label="详细地址">
                <Input placeholder="请输入详细地址" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[96, 16]}>
            <Col span={8}>
              <Form.Item name="area" label="面积㎡">
                <InputNumber placeholder="请输入面积" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="storeType" label="库存类型">
                <Input placeholder="请输入库存类型" />
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

export default StorageAgencyForm;
