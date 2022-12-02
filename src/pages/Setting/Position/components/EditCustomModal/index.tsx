/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-14 16:43:05
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 09:51:54
 * @FilePath: /oiocns-react/src/pages/Setting/Dept/components/EditCustomModal/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置
 * 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
import React, { useEffect } from 'react';
import { Modal, message } from 'antd';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';

import cls from './index.module.less';
import { ObjectManagerList } from '../../datamock';
// import UploadAvatar from '../UploadAvatar';

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

type DataItem = {
  name: string;
  state: string;
};

const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: '岗位名称',
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
    title: '岗位编号',
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
    title: '所属身份',
    dataIndex: 'belongTarget',
    valueType: 'treeSelect',
    width: 'm',
    fieldProps: {
      options: ObjectManagerList,
      fieldNames: {
        children: 'children',
        label: 'name',
        value: 'key',
      },
      showSearch: true,
      filterTreeNode: true,
      treeNodeFilterProp: 'name',
      // multiple: true,
      treeDefaultExpandAll: true,
    },
  },
  {
    title: '岗位简介',
    dataIndex: 'remark',
    valueType: 'textarea',
    width: 'm',
  },
  {
    valueType: 'divider',
  },
];

const EditCustomModal = (props: Iprops) => {
  const { open, title, onOk, handleOk, handleCancel, selectId } = props;
  useEffect(() => {}, []);

  return (
    <div className={cls['edit-custom-modal']}>
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
            onOk();
          }}
          columns={columns}
        />
      </Modal>
    </div>
  );
};

export default EditCustomModal;
