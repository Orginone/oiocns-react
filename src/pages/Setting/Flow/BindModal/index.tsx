import React from 'react';
import { Modal, Form } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormSelect,
  ProFormList,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-components';

type BindModalProps = {
  isOpen: boolean;
  bindAppMes: {};
  onOk: () => void;
};

const BindModal: React.FC<BindModalProps> = ({ bindAppMes, isOpen }) => {
  const [form] = Form.useForm();
  console.log('bindAppMes', bindAppMes);
  return (
    <Modal title={`当前流程：${bindAppMes?.name}`} open={isOpen} width={900}>
      <ProForm
        layout="horizontal"
        submitter={false}
        form={form}
        onFinish={async (e) => {
          const currentData = {
            processId: bindAppMes.id,
          };
        }}>
        <ProFormList
          name="labels"
          initialValue={[{}]}
          deleteIconProps={{
            Icon: CloseCircleOutlined,
            tooltipText: '删除这个流程字段',
          }}
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新增应用绑定',
          }}>
          <ProFormGroup key="group">
            <ProFormSelect
              name="select"
              width={280}
              label="绑定应用（多选）"
              mode="multiple"
              valueEnum={{
                open: '未解决',
                closed: '已解决',
              }}
              placeholder="请选择要绑定的应用"
              rules={[{ required: true, message: '请选择要绑定的应用!' }]}
            />
            <ProFormText
              name="value"
              label="业务名称"
              rules={[{ required: true, message: '请填写业务名称!' }]}
            />
          </ProFormGroup>
        </ProFormList>
      </ProForm>
    </Modal>
  );
};

export default BindModal;
