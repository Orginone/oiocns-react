import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import cls from '../index.module.less';
import React from 'react';

interface Iprops {
  title: string;
  open: boolean;
  onOk: (data: any) => void;
  handleOk: () => void;
}

type DataItem = {
  name: string;
  state: string;
};

const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    initialValue: '',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '名称为必填项',
        },
      ],
    },
    width: 'm',
  },
  {
    title: '编码',
    dataIndex: 'code',
    initialValue: '',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '编码为必填项',
        },
      ],
    },
    width: 'm',
  },
  {
    title: '是否公开',
    dataIndex: 'public',
    valueType: 'switch',
    width: 'm',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    valueType: 'textarea',
    width: 'm',
  },
  {
    valueType: 'divider',
  },
];

const newPosition = (props: Iprops) => {
  const { title, open, onOk, handleOk } = props;

  const addmodal = (
    <Modal
      title={title}
      open={open}
      getContainer={false}
      width={450}
      destroyOnClose={true}
      onCancel={() => handleOk()}
      footer={null}>
      <BetaSchemaForm<DataItem>
        shouldUpdate={false}
        layoutType="Form"
        onFinish={async (values) => {
          console.log('finish===', values);
          onOk(values);
        }}
        columns={columns}
      />
    </Modal>
  );
  return <div className={cls[`add-person-modal`]}>{addmodal}</div>;
};

export default newPosition;
