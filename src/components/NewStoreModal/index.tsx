import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Avatar, Space, Col, Select } from 'antd';
import cls from './index.module.less';

/*
    新建商店弹窗
*/

interface Iprops {
  title: string; // 弹窗标题
  open: boolean; // 弹窗开关
  onOk: (formData: any) => void; // 确认回调
  onCancel: () => void; // 取消回调
}

const { TextArea } = Input;

const NewStoreModal = (props: Iprops) => {
  const { title, open, onOk, onCancel } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
    // console.log('3211232131', router);
  }, [open]);
  const titles = (
    <Space className={cls[`new-store-title`]} size={8}>
      <div className={cls[`new-store-title-before`]}></div>
      <span className={cls[`new-store-info`]}>商店基本信息</span>
    </Space>
  );
  //触发确认事件
  const handleOk = async () => {
    const data = await form.validateFields();

    onOk && onOk(data);
  };
  // 内容区域
  const formStore = (
    <Form
      form={form}
      name="new-store"
      layout={'vertical'}
      initialValues={{ public: true }}>
      <Row gutter={16}>
        <Col span={13}>
          <Form.Item
            name="name"
            label="商店名称"
            rules={[
              { required: true, message: '请输入商店名称' },
              { min: 3, message: '商店名称至少有3个字' },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="商店编码"
            rules={[{ required: true, message: '商店编码' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="public" label="类型">
            <Select
              options={[
                {
                  value: true,
                  label: '公开',
                },
                {
                  value: false,
                  label: '不公开',
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input />
          </Form.Item>
        </Col>
        <Col span={11} className="flex flex-center">
          <Form.Item name="img">
            <Avatar
              size={140}
              src={
                'https://img0.baidu.com/it/u=2325623136,2218385807&fm=253&fmt=auto&app=138&f=JPEG?w=900&h=500'
              }
            />
            <div className={`${cls['store-avatar-name']} flex flex-center`}>商店封面</div>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="remark" label="备注">
            <TextArea
              // value={value}
              // onChange={(e) => setValue(e.target.value)}
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
  return (
    <div className={cls[`new-store-modal`]}>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        width="700px"
        onCancel={onCancel}
        getContainer={false}
        destroyOnClose={true}
        closable={false}>
        {titles}
        {formStore}
      </Modal>
    </div>
  );
};
export default NewStoreModal;
