/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-14 16:43:05
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 09:51:54
 * @FilePath: /oiocns-react/src/pages/Setting/Dept/components/EditCustomModal/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Space, Button, message } from 'antd';
import cls from './index.module.less';
import UploadAvatar from '../UploadAvatar';
import settingController from '@/ts/controller/setting';
/* 
  编辑
*/
interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  selectId?: string;
}

const { TextArea } = Input;

const EditCustomModal = (props: Iprops) => {
  const { open, title, onOk, handleOk, handleCancel, selectId } = props;
  const [form] = Form.useForm();
  useEffect(() => {}, []);

  return (
    <div className={cls['edit-custom-modal']}>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={() => handleCancel()}
        getContainer={false}
        footer={null}>
        <Form form={form} layout="vertical">
          <Form.Item label="" name="avatar" noStyle>
            <UploadAvatar />
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item
                name="name"
                label="单位名称"
                rules={[{ required: true, message: '请输入单位名称!' }]}>
                <Input placeholder="请输入单位名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="单位编号"
                rules={[{ required: true, message: '请输入单位编号!' }]}>
                <Input placeholder="请输入单位编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="teamName"
                label="我的部门"
                rules={[{ required: true, message: '请输入岗位名称!' }]}>
                <Input placeholder="请输入岗位名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teamCode"
                label="团队编码"
                rules={[{ required: true, message: '请输入团编码' }]}>
                <Input placeholder="请输入团队编码" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="描述"
                rules={[{ required: true, message: '请输入单位描述!' }]}>
                <TextArea
                  // value={value}
                  // onChange={(e) => setValue(e.target.value)}
                  placeholder="请输入单位描述"
                  autoSize={{ minRows: 1, maxRows: 1 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space>
              <Button
                type="primary"
                onClick={async () => {
                  const value = await form.validateFields();
                  value.parentId = selectId;
                  if (value) {
                    const curentValue = await settingController.createDepartment(value);
                    if (!curentValue.success) {
                      message.error(curentValue.msg);
                    } else {
                      message.success('添加成功');
                      settingController.trigger('updateDeptTree');
                      handleOk();
                    }
                  }
                }}>
                完成
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EditCustomModal;
