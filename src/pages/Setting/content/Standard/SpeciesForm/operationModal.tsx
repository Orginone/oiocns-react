import { OperationModel } from '@/ts/base/model';
import { XOperation } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { ITarget, ISpeciesItem } from '@/ts/core';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { targetsToTreeData } from '../../..';
// import ProFormAuth from './render/widgets/ProFormAuth';

interface Iprops {
  title: string;
  open: boolean;
  data: XOperation | undefined;
  handleCancel: () => void;
  handleOk: (res: any) => void;
  current: ISpeciesItem;
  target?: ITarget;
}

/**
 * 默认备注：表单默认布局
 */
export const defaultRemark: any = {
  type: 'object',
  properties: {},
  labelWidth: 120,
  layout: 'horizontal',
  col: 12,
};

/*
  业务标准编辑模态框
*/
const OperationModal = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const [form] = useForm<OperationModel>();
  if (data && (title.includes('修改') || title.includes('编辑'))) {
    form.setFieldsValue(data);
  }

  return (
    <Modal
      title={data?.name || title}
      open={open}
      onOk={async () => {
        const value = {
          ...{ remark: JSON.stringify(defaultRemark) },
          ...data,
          ...form.getFieldsValue(),
          speciesId: current.id,
        };
        if (title.includes('新增')) {
          const result = await current.createOperation(value);
          form.resetFields();
          handleOk(result);
        } else {
          const result = await current.updateOperation(value);
          form.resetFields();
          handleOk(result);
        }
      }}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={640}>
      <ProForm<OperationModel>
        layout="vertical"
        grid={true}
        form={form}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
          resetButtonProps: {
            style: { display: 'none' },
          },
          submitButtonProps: {
            style: { display: 'none' },
          },
        }}>
        <ProFormText
          width="md"
          name="name"
          label="表单名称"
          placeholder="请输入表单名称"
          required={true}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: '表单名称为必填项' }]}
        />
        <ProFormText
          width="md"
          name="code"
          label="表单代码"
          placeholder="请输入表单代码"
          required={true}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: '表单代码为必填项' }]}
        />
        <ProFormTreeSelect
          width="md"
          name="belongId"
          label="制定组织"
          placeholder="请选择制定组织"
          required={true}
          colProps={{ span: 12 }}
          request={async () => {
            const res = await orgCtrl.getTeamTree();
            return targetsToTreeData(res);
          }}
          fieldProps={{
            disabled: title === '修改' || title === '编辑',
            showSearch: true,
          }}
        />
        <ProFormSelect
          width="md"
          name="public"
          label="向下级组织公开"
          placeholder="请选择是否向下级组织公开"
          required={true}
          colProps={{ span: 12 }}
          fieldProps={{
            options: [
              {
                value: 'true',
                label: '公开',
              },
              {
                value: 'false',
                label: '不公开',
              },
            ],
          }}
          formItemProps={{
            rules: [{ required: true, message: '是否公开为必填项' }],
          }}
        />
        {/* <ProFormAuth
          width="md"
          name="beginAuthId"
          placeholder="请选择角色"
          colProps={{ span: 12 }}
        /> */}
      </ProForm>
    </Modal>
  );
};

export default OperationModal;
