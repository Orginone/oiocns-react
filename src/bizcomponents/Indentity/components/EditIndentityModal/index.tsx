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
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import {
  IDepartment,
  IPerson,
  IGroup,
  ICompany,
  ICohort,
} from '@/ts/core/target/itarget';

/* 
  编辑
*/
interface Iprops {
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  defaultData: IIdentity;
  callback: Function;
  reObject: IDepartment | IPerson | IGroup | ICompany | ICohort;
}

// initialValues={item}
const EditIndentityModal = (props: Iprops) => {
  const { open, onOk, handleOk, reObject, callback, defaultData } = props;
  const [authTree, setAuthTree] = useState<IAuthority>();
  useEffect(() => {
    authTreeData();
  }, []);
  const authTreeData = async () => {
    const res = await reObject.selectAuthorityTree(false);
    setAuthTree(res);
  };
  const getColumn = (target: IIdentity): ProFormColumnsType<IIdentity>[] => {
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
          disabled: true,
          fieldNames: {
            children: 'children',
            label: 'name',
            value: 'id',
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
        title={'编辑'}
        open={open}
        getContainer={false}
        width={450}
        destroyOnClose={true}
        onCancel={() => handleOk()}
        footer={null}>
        <BetaSchemaForm<any>
          shouldUpdate={false}
          layoutType="Form"
          onFinish={async (values) => {
            const res = await defaultData.updateIdentity(
              values.name,
              values.code,
              values.remark,
            );
            if (res.success) {
              callback();
              message.success('修改成功');
            } else {
              message.error(res.msg);
            }
            onOk();
          }}
          columns={getColumn(defaultData)}
        />
      </Modal>
    </div>
  );
};

export default EditIndentityModal;
