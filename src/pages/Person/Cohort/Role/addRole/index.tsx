import React, { useState } from 'react';
// import cls from './index.module.less';
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { message } from 'antd';
import JsonFrom from '../../../../../components/SchemaForm';
import { schema } from '../../../../../../src/ts/base';
import CohortController from '../../../../../ts/controller/cohort/index';

interface indexType {
  open: boolean;
  setOpen: Function;
  data: schema.XAuthority;
  id: string;
}
type target = {
  name: string;
  code: string;
  team: teamValueType;
};
type teamValueType = {
  remark: string;
};

interface DataItem {
  Switch: boolean;
  cascader: string[];
  target: target;
}

function getColumns(data: schema.XAuthority): ProFormColumnsType<DataItem>[] {
  const columns: ProFormColumnsType<DataItem>[] = [
    {
      // width: 'md',
      name: 'name',
      // initialValue : {item}.item?{item}.item?.name:null,
      // tooltip="最长为 24 位"
      title: '角色名称',
      dataIndex: ['target', 'name'],
      formItemProps: {
        rules: [
          // {
          //   //[^\u4E00-\u9FA5]
          //   pattern: /^[\u4e00-\u9fa5]{2,6}$/,
          //   message: '群组内容只能为长度2-6的中文',
          //   validateTrigger: 'onBlur',
          // },
          // { required: true, message: '请输入群组名称' },
        ],
      },
    },

    {
      valueType: 'group',
      width: 'md',
      colProps: { md: 24 },
      columns: [
        {
          // width: 'md',
          name: 'code',
          // tooltip="最长为 24 位"
          title: '角色编号',
          // initialValue : {item}.item?{item}.item?.code:null,
          dataIndex: ['target', 'code'],
          formItemProps: {
            rules: [
              // {
              //   //[^\u4E00-\u9FA5]
              //   pattern: /^[a-zA-Z]+$/,
              //   message: '群组编号为英文字符组成',
              //   validateTrigger: 'onBlur',
              // },
              // { required: true, message: '群组编号不能为空' },
              // { message: '请输入长度为2-10字符的群组编号', min: 2, max: 20 },
            ],
          },
        },
      ],
    },
    {
      valueType: 'switch',
      title: '是否公开',
      dataIndex: 'Switch',
      fieldProps: {
        style: {
          width: '200px',
        },
      },
      // width: 'md',
      colProps: {
        xs: 12,
        md: 20,
      },
    },
    {
      title: '上级节点',
      key: 'cascader',
      dataIndex: 'cascader',
      width: 270,
      fieldProps: {
        options: [data],
        fieldNames: {
          children: 'nodes',
          label: 'name',
          value: 'id',
        },
        changeOnSelect: true,
        multiple: false,
      },
      valueType: 'cascader',
    },
    {
      valueType: 'group',
      // width: 'md',
      // colProps: { md: 24 },
      columns: [
        {
          valueType: 'textarea',
          // width: 'md',
          name: 'remark', // initialValue : {item}.item?{item}.item?.remark:null,
          // tooltip="最长为 24 位"
          title: '角色简介',
          dataIndex: ['target', 'team', 'remark'],
          formItemProps: {
            // rules: [
            //   { required: true, message: '请输入群组简介' },
            //   { message: '群组简介内容不能超过200字符', max: 200 },
            // ],
          },
        },
      ],
    },
  ];
  return columns;
}

const AddRole: React.FC<indexType> = ({ setOpen, open, data, id, ...otherConfig }) => {
  const handleAddRole = async (values: DataItem) => {
    console.log(id);
    CohortController.addRole(
      id,
      values.target.name,
      values.target.code,
      values.Switch,
      values.cascader,
      values.target.team.remark,
    );
    // Provider.person.createProduct(values);
    console.log('输出表单值', values);
  };
  // const [showCreateModal, setShowCreateModal] = useState<boolean>(true); //  是否显示创建应用窗口
  // const [layoutType, setLayoutType] = useState<ProFormLayoutType>('Form');
  console.log('列信息', data);
  return (
    <>
      <JsonFrom<DataItem>
        layoutType="ModalForm"
        open={open}
        width={550}
        title="新增角色"
        onFinish={handleAddRole}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setOpen(false),
        }}
        colProps={{ span: 24 }}
        columns={getColumns(data)}
      />
      {/* <Space
        style={{
          width: '100%',
        }}
        direction="vertical">
        <ProFormSelect
          label="布局方式"
          options={[
            'Form',
            'ModalForm',
            'DrawerForm',
            'LightFilter',
            'QueryFilter',
            'StepsForm',
            'StepForm',
            'Embed',
          ]}
          fieldProps={{
            value: layoutType,
            onChange: (e) => setLayoutType(e),
          }}
        />
      </Space> */}
    </>
  );
};

export default AddRole;
