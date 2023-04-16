import userCtrl from '@/ts/controller/setting';
import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react';
import { XFlowDefine } from '@/ts/base/schema';
import { CreateDefineReq } from '@/ts/base/model';
import { ITarget } from '@/ts/core';

interface Iprops {
  open: boolean;
  title: string;
  current?: XFlowDefine;
  target: ITarget;
  handleOk: (res: CreateDefineReq) => void;
  handleCancel: () => void;
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

export const toTreeData = (species: any[]): any[] => {
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
  useEffect(() => {
    form.setFieldsValue({
      ...current,
      sourceIds: current?.sourceIds?.split(',').filter((id: any) => id != '') || [],
    });
  });

  return (
    <Modal
      title={title}
      open={open}
      onOk={async () => {
        const value = {
          ...{ remark: JSON.stringify(defaultRemark) },
          ...current,
          ...form.getFieldsValue(),
        };
        handleOk({
          id: current?.id,
          code: value.name,
          name: value.name,
          sourceIds: value.sourceIds?.join(','),
          remark: value.remark,
          belongId: value.belongId,
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
          gutter: [24, 0],
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
          name="belongId"
          label="制定组织"
          placeholder="请选择制定组织"
          required={true}
          colProps={{ span: 12 }}
          request={async () => {
            return await userCtrl.getTeamTree();
          }}
          fieldProps={{
            disabled: title === '修改' || title === '编辑',
            showSearch: true,
            fieldNames: { label: 'teamName', value: 'id', children: 'subTeam' },
            filterTreeNode: true,
            treeNodeFilterProp: 'teamName',
          }}
        />
        <ProFormSelect
          width="md"
          name="isCreate"
          label="是否创建实体"
          placeholder="请选择是否创建实体"
          required={true}
          colProps={{ span: 12 }}
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
                  name="sourceIds"
                  label="操作实体"
                  placeholder="请选择操作实体"
                  required={true}
                  colProps={{ span: 12 }}
                  request={async () => {
                    const species = await target.loadSpeciesTree();
                    let tree = toTreeData([species]);
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
      </ProForm>
    </Modal>
  );
};

export default DefineInfo;
