import { ITarget } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import { ProColumns } from '@ant-design/pro-components';
import React, { useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import AuthorityModal from './modal';
import { message } from 'antd';
import useObjectUpdate from '@/hooks/useObjectUpdate';

interface IProps {
  current: ITarget;
  isSuperAdmin: boolean;
}
/**
 * 权限设定
 * @returns
 */
const AuthorityStandrad: React.FC<IProps> = ({ current, isSuperAdmin }: IProps) => {
  const [openType, setOpenType] = useState<string>('');
  const [authority, setAuthority] = useState<IAuthority>();
  const [key, forceUpdate] = useObjectUpdate(current);
  const authorityCloumns: ProColumns<IAuthority>[] = [
    {
      title: '权限名称',
      dataIndex: ['target', 'name'],
      key: 'name',
      width: 200,
    },
    {
      title: '共享组织',
      dataIndex: ['target', 'belongId'],
      key: 'belongId',
      width: 200,
      render: (_, record) => {
        const team = userCtrl.findTeamInfoById(record.target.belongId);
        if (team) {
          return team.name;
        }
      },
    },
    {
      title: '备注',
      dataIndex: ['target', 'renark'],
      key: 'renark',
      width: 300,
    },
    {
      title: '创建人',
      dataIndex: ['target', 'createUser'],
      key: 'createUser',
      width: 200,
      render: (_, record) => {
        const team = userCtrl.findTeamInfoById(record.target.createUser);
        if (team) {
          return team.name;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: ['target', 'createTime'],
      key: 'createTime',
      width: 150,
    },
  ];

  return (
    <>
      <CardOrTable<IAuthority>
        key={key}
        rowKey={'id'}
        pagination={false}
        dataSource={[]}
        operation={(item) => {
          return isSuperAdmin
            ? [
                {
                  key: 'create',
                  label: '新增',
                  onClick: async () => {
                    setAuthority(item);
                    setOpenType('create');
                  },
                },
                {
                  key: 'edit',
                  label: '编辑',
                  onClick: async () => {
                    setAuthority(item);
                    setOpenType('edit');
                  },
                },
                {
                  key: 'remove',
                  label: '删除',
                  onClick: async () => {
                    if ((await item.delete()).success) {
                      message.success('删除成功');
                      forceUpdate();
                    }
                  },
                },
              ]
            : [];
        }}
        columns={authorityCloumns}
        showChangeBtn={false}
        request={async (_) => {
          let res = await current.loadAuthorityTree(true);
          return {
            offset: 0,
            limit: 10,
            result: res ? [res] : [],
            total: 1,
          };
        }}
      />
      {authority && (
        <AuthorityModal
          openType={openType}
          current={authority}
          handleCancel={() => {
            setAuthority(undefined);
            setOpenType('');
          }}
          handleOk={async (model) => {
            let success;
            switch (openType) {
              case 'create':
                success = (
                  await authority.createSubAuthority(
                    model.name,
                    model.code,
                    model.public,
                    model.remark,
                  )
                ).success;
                break;
              case 'edit':
                success = (
                  await authority.updateAuthority(
                    model.name,
                    model.code,
                    model.public,
                    model.remark,
                  )
                ).success;
                break;
            }
            if (success) {
              setAuthority(undefined);
              forceUpdate();
              setOpenType('');
            }
          }}
        />
      )}
    </>
  );
};

export default AuthorityStandrad;
