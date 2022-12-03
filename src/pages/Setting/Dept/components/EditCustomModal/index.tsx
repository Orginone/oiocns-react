/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-14 16:43:05
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 09:51:54
 * @FilePath: /oiocns-react/src/pages/Setting/Dept/components/EditCustomModal/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Space, Button, message } from 'antd';
import cls from './index.module.less';
import UploadAvatar, { avatarUpload } from '../UploadAvatar';
import SettingService from '../../service';
import userCtrl from '@/ts/controller/setting/userCtrl';

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
  const setting = SettingService.getInstance();
  // 头像的保存
  const [fileList, setFileList] = useState<avatarUpload[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

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
        destroyOnClose={true}
        footer={null}>
        <Form form={form} layout="vertical">
          <Form.Item label="" name="avatar" noStyle>
            <UploadAvatar fileList={fileList} setFileList={setFileList} />
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item
                name="name"
                label="部门名称"
                rules={[{ required: true, message: '请输入部门名称!' }]}>
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="部门编号"
                rules={[{ required: true, message: '请输入部门编号!' }]}>
                <Input placeholder="请输入部门编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="teamName"
                label="团队名称"
                rules={[{ required: true, message: '请输入团队名称!' }]}>
                <Input placeholder="请输入团队名称" />
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
                rules={[{ required: true, message: '请输入部门描述!' }]}>
                <TextArea
                  placeholder="请输入部门描述"
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
                  if (value) {
                    debugger;
                    value.parentId = setting.getCurrTreeDeptNode();
                    if (fileList.length > 0 && fileList[0].shareLink) {
                      value.avatar = fileList[0].shareLink;
                    }
                    const curentValue = await setting.createDepartment(value);
                    if (!curentValue.success) {
                      message.error(curentValue.msg);
                      // form.resetFields();
                    } else {
                      message.success('添加成功');
                      form.resetFields();
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
