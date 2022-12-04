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
import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';

import cls from './index.module.less';
import { ObjectManagerList } from '../../datamock';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
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
  defaultData: IIdentity;
}

type DataItem = {
  name: string;
  state: string;
};

// initialValues={item}
const EditCustomModal = (props: Iprops) => {
  const { open, title, onOk, handleOk, handleCancel, selectId, defaultData } = props;
  const [authTree, setAuthTree] = useState<IAuthority>();
  useEffect(() => {
    authTreeData();
  }, []);
  const authTreeData = async () => {
    const res = await userCtrl.Company.selectAuthorityTree(false);
    setAuthTree(res);
  };
  const getColumn = (target: IIdentity): ProFormColumnsType<IIdentity>[] => {
    console.log(222333444, authTree);
    const columns: ProFormColumnsType<IIdentity>[] = [
      {
        title: '岗位名称',
        dataIndex: 'name',
        initialValue: target ? target.target.name : '',
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
        initialValue: target ? target.target.code : '',
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
        dataIndex: 'id',
        valueType: 'treeSelect',
        width: 'm',
        fieldProps: {
          options: [authTree],
          fieldNames: {
            children: 'children',
            label: 'label',
            value: 'id',
          },
          showSearch: true,
          filterTreeNode: true,
          treeNodeFilterProp: 'label',
          // multiple: true,
          treeDefaultExpandAll: true,
        },
      },
      {
        title: '岗位简介',
        dataIndex: 'remark',
        valueType: 'textarea',
        initialValue: target ? target.target.remark : '',
        width: 'm',
      },
      {
        valueType: 'divider',
      },
    ];
    return columns;
  };
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
        <BetaSchemaForm<IIdentity>
          shouldUpdate={false}
          layoutType="Form"
          onFinish={async (values) => {
            console.log('finish===', values);
            onOk();
          }}
          columns={getColumn(defaultData)}
        />
      </Modal>
    </div>
  );
};

export default EditCustomModal;
