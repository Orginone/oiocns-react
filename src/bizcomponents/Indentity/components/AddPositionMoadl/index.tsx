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
import { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';

import cls from './index.module.less';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import {
  IDepartment,
  IPerson,
  IGroup,
  ICompany,
  ICohort,
} from '@/ts/core/target/itarget';
// import UploadAvatar from '../UploadAvatar';

/* 
  编辑
*/
interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
  authTree: IAuthority[] | undefined;
  reObject: IDepartment | IPerson | IGroup | ICompany | ICohort;
}
const EditCustomModal = (props: Iprops) => {
  const { open, title, onOk, handleOk, authTree, reObject } = props;
  const columns: ProFormColumnsType<IIdentity>[] = [
    {
      title: '岗位名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '岗位编号',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '所属角色',
      key: 'authId',
      dataIndex: 'authId',
      width: 'md',
      valueType: 'treeSelect',
      request: async () => authTree || [],
      fieldProps: {
        fieldNames: { label: 'name', value: 'id' },
        showSearch: true,
        filterTreeNode: true,
        // multiple: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
    },
    {
      title: '岗位简介',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
  ];
  return (
    <div className={cls['edit-custom-modal']}>
      <Modal
        title={title}
        open={open}
        getContainer={false}
        width={450}
        destroyOnClose
        onCancel={() => handleOk()}
        footer={null}>
        <BetaSchemaForm<any>
          shouldUpdate={false}
          layoutType="Form"
          onFinish={async (values) => {
            await reObject.createIdentity({
              name: values.name,
              code: values.code,
              remark: values.remark,
              authId: values.authId,
            });
            message.success('操作成功');
            onOk();
          }}
          columns={columns}
        />
      </Modal>
    </div>
  );
};

export default EditCustomModal;
