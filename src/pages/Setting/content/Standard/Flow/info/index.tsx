import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { XFlowDefine } from '@/ts/base/schema';
import { CreateDefineReq } from '@/ts/base/model';
import { ITarget } from '@/ts/core';
import orgCtrl from '@/ts/controller/index';

interface Iprops {
  open: boolean;
  title: string;
  current?: XFlowDefine;
  target: ITarget;
  handleOk: (res: CreateDefineReq) => void;
  handleCancel: () => void;
}

const toTreeData = (species: any[]): any[] => {
  return species.map((t) => {
    return {
      label: t.name,
      value: t.id,
      children: toTreeData(t.children),
    };
  });
};

/*
  业务标准编辑模态框
*/
const DefineInfo = ({ open, title, handleOk, handleCancel, target, current }: Iprops) => {
  const [form] = useForm<any>();
  if (current) {
    form.setFieldsValue({
      ...current,
      operationIds: current?.sourceIds?.split(',').filter((id: any) => id != '') || [],
    });
  } else {
    form.setFieldsValue({});
  }

  return (
    <Modal
      title={title}
      open={open}
      onOk={async () => {
        const value = {
          ...current,
          ...form.getFieldsValue(),
        };
        handleOk({
          id: current?.id,
          code: value.name,
          name: value.name,
          sourceIds: value.isCreate ? '' : value.operationIds?.join(','),
          remark: value.remark,
          shareId: value.shareId,
          belongId: '',
          isCreate: value.isCreate,
        });
      }}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={700}>
      <ProForm<any>
        layout="vertical"
        grid={true}
        form={form}
        rowProps={{
          gutter: [12, 0],
        }}
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
          label="办事名称"
          placeholder="请输入办事名称"
          required={true}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: '办事名称为必填项' }]}
        />
        <ProFormTreeSelect
          width="md"
          name="shareId"
          label="共享组织"
          placeholder="请选择共享组织"
          required={true}
          colProps={{ span: 12 }}
          initialValue={target.metadata.belongId}
          fieldProps={{
            disabled: title === '修改' || title === '编辑',
            showSearch: true,
          }}
        />
        <ProFormSelect
          width="md"
          name="isCreate"
          label="是否创建实体"
          placeholder="请选择是否创建实体"
          required={true}
          colProps={{ span: 12 }}
          initialValue={current?.isCreate}
          request={async () => {
            let array: any[] = [
              {
                value: true,
                label: '是',
              },
              {
                value: false,
                label: '否',
              },
            ];
            return array;
          }}
          fieldProps={{
            showSearch: true,
            allowClear: true,
          }}
        />
        <ProFormDependency name={['isCreate']}>
          {({ isCreate }) => {
            if (!isCreate)
              return (
                <ProFormTreeSelect
                  width="md"
                  name="operationIds"
                  label="操作实体"
                  placeholder="请选择操作实体"
                  required={true}
                  colProps={{ span: 12 }}
                  request={async () => {
                    let tree = toTreeData(await target.loadSpeciesTree());
                    return tree;
                  }}
                  fieldProps={{
                    showSearch: true,
                    multiple: true,
                    allowClear: true,
                  }}
                />
              );
            return null;
          }}
        </ProFormDependency>
        <ProFormTextArea
          width="md"
          name="remark"
          label="备注"
          placeholder="请输入备注信息"
          required={false}
          colProps={{ span: 24 }}
        />
      </ProForm>
    </Modal>
  );
};

export default DefineInfo;
