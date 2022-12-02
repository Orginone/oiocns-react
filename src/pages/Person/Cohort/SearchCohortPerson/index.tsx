import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Input, Tooltip } from 'antd';
import { schema } from '../../../../ts/base';
import CohortController from '../../../../ts/controller/cohort/index';
import CardOrTable from '@/components/CardOrTableComp';
import Cohort from '../../../../ts/core/target/cohort';
import type { ProColumns } from '@ant-design/pro-components';
interface indexType {
  searchCallback: Function;
  cohort: Cohort;
}

const CohortPerson: React.FC<indexType> = (props) => {
  useEffect(() => {
    getTableList();
  }, []);

  const [data, setData] = useState<schema.XTarget[]>([]);

  const [value, setValue] = useState<string>();
  const getTableList = async () => {
    const res = await CohortController.getCohortPeronList(props.cohort);
    setData(res);
  };
  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      const res = await CohortController.searchPerson(props.cohort, e.target.value);
      console.log(res);
      if (res.data.result != null) {
        setData([res.data.result[0]]);
      } else {
        getTableList();
      }
    }
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
      <div style={{ paddingBottom: '16px' }}>
        <Input
          className={cls['search-person-input']}
          placeholder="请输入用户账号"
          suffix={
            <Tooltip title="搜索用户">
              <SearchOutlined />
            </Tooltip>
          }
          value={value}
          onChange={keyWordChange}
        />
      </div>
      <CardOrTable<schema.XTarget>
        dataSource={data}
        total={10}
        page={1}
        rowSelection={{
          type: 'radio',
          onSelect: (record: any, selected: any, selectedRows: any) => {
            console.log(record, selected, selectedRows);
            props.searchCallback(record);
          },
        }}
        tableAlertRender={false}
        tableAlertOptionRender={false}
        showChangeBtn={false}
        hideOperation={true}
        columns={cohortColumn as any}
        rowKey={'id'}
      />
    </>
  );
};

export default CohortPerson;
