import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import cls from '../index.module.less';
import React from 'react';
import { IAuthority } from '@/ts/core/target/authority/iauthority';

interface Iprops {
  title: string;
  open: boolean;
  handleOk: () => void;
  authData: IAuthority;
}

type DataItem = {
  name: string;
  state: string;
  code: string;
  public: boolean;
  remark: string;
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
    fieldProps: {
      style: {
        width: '200px',
      },
    },
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
  const { title, open, handleOk, authData } = props;

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
          const res = await authData.createSubAuthority(
            values.name,
            values.code,
            values.public,
            values.remark,
          );
          if (res.success) {
            message.info('新增成功');
          } else {
            message.error(res.msg);
          }
        }}
        columns={columns}
      />
    </Modal>
  );
  return <div className={cls[`add-person-modal`]}>{addmodal}</div>;
};

export default newPosition;
