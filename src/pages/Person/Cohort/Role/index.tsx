import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import Person from '../../../../bizcomponents/PersonInfo/index';
import CardOrTable from '../../../../components/CardOrTableComp';
import { CertificateType } from '../../../../../typings/Certificate';
import cls from './index.module.less';
import CohortController from '../../../../ts/controller/cohort/index';
import { schema } from '../../../../../src/ts/base';
import AddRole from './addRole/index';
import type { ProColumns } from '@ant-design/pro-components';
import Cohort from '@/ts/core/target/cohort';

/**
 * 个人信息
 * @returns
 */
const RoleManage: React.FC<any> = (props) => {
  const [data, setData] = useState<schema.XAuthority>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getTableList();
  }, []);
  useEffect(() => {
    CohortController.setCallBack(setData);
  }, []);
  useEffect(() => {}, [data]);
  const getTableList = async () => {
    const cohort: Cohort = await CohortController.getCohort(
      props.location.state.cohortId,
    );
    setData(cohort.authorityTree?.authority);
  };

  const certificateColumn: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '所属',
      dataIndex: 'name',
    },
    {
      title: '是否公开',
      dataIndex: 'public',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
  const { Title } = Typography;
  const divStyle: React.CSSProperties = {
    marginTop: '55px',
  };
  const renderOperation = (item: schema.XAuthority): CertificateType.OperationType[] => {
    return [
      {
        key: 'add',
        label: '新增',
        onClick: () => {
          setOpen(true);
          console.log('按钮事件', 'add', item);
        },
      },
    ];
  };

  const tableAlertRender = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys);
  };
  return (
    <div className={cls['person-info-container']}>
      <div>
        <Person />
      </div>
      <AddRole
        key={data?.id}
        open={open}
        data={data!}
        setOpen={setOpen}
        id={props.location.state.cohortId}
      />
      <div>
        <div className={cls['person-info-H']}>
          <Title level={4}>角色维护</Title>
        </div>
      </div>
      <div>
        {data && (
          <CardOrTable<schema.XAuthority>
            dataSource={[data]}
            tableAlertRender={tableAlertRender}
            rowSelection={{}}
            showChangeBtn={true}
            operation={renderOperation}
            columns={certificateColumn as any}
            style={divStyle}
            rowKey={'id'}
            childrenColumnName={data ? 'nodes' : ''}
            expandable={{ defaultExpandAllRows: true }}
          />
        )}
      </div>
    </div>
  );
};

export default RoleManage;
