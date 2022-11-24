import React, { useState, useEffect } from 'react';
// import cls from './index.module.less';
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import JsonFrom from '../../../../components/SchemaForm';
import { schema } from '../../../../ts/base';
import CohortController from '../../../../ts/controller/cohort/index';
import CardOrTable from '@/components/CardOrTableComp';
import Cohort from '../../../../ts/core/target/cohort';
import { Person } from '@/module/org';
import type { ProColumns } from '@ant-design/pro-components';
interface indexType {
  searchCallback: Function;
  cohort: Cohort;
}

interface selectType{
  selectedRowKeys:string[];
  selectedRows:Person[];
}

const CohortPerson: React.FC<indexType> = (props) => {
  useEffect(() => {
    getTableList();
  }, []);

  const [data, setData] = useState<schema.XTarget[]>([]);
  // const tableAlertRender = (selectedRowKeys: selectType) => {
  //   console.log("输出值")
  //   props.searchCallback(selectedRowKeys.selectedRows[0]);
  // };
  const getTableList = async () => {
    const res = await CohortController.getCohortPeronList(props.cohort);
    setData(res);
  };

  const cohortColumn: ProColumns<any>[] = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'index',
      width: 50,
      render: (_key: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '账号',
      dataIndex: 'code',
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '姓名',
      dataIndex: ['team', 'name'],
    },
    {
      title: '手机号',
      dataIndex: ['team', 'code'],
    },
    {
      title: '座右铭',
      dataIndex: ['team', 'remark'],
    },
  ];

  return (
    <>
      <CardOrTable<schema.XTarget>
        dataSource={data}
        total={10}
        page={1}
        // tableAlertRender={tableAlertRender}
        rowSelection={{
          type:'radio',
          onSelect: (record: any, selected: any, selectedRows: any) => {
            console.log(record, selected, selectedRows);
            props.searchCallback(record);
          },
        }}
        showChangeBtn={false}
        // defaultPageType={'table'}
        hideOperation={true}
        columns={cohortColumn as any}
        // style={divStyle}
        // onChange={handlePageChange}
        rowKey={'id'}
      />
    </>
  );
};

export default CohortPerson;
