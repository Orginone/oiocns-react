import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Input, Tooltip } from 'antd';
import { schema } from '@/ts/base';
import CardOrTable from '@/components/CardOrTableComp';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import userCtrl from '@/ts/controller/setting/userCtrl';
interface indexType {
  searchCallback: Function;
  memberData: schema.XTarget[];
}

const CohortPerson: React.FC<indexType> = (props) => {
  useEffect(() => {
    getTableList();
  }, []);

  const [data, setData] = useState<schema.XTarget[]>([]);

  const [value, setValue] = useState<string>();
  const getTableList = async () => {
    setData(props.memberData);
  };
  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      const res = await userCtrl.User?.searchPerson(e.target.value);
      if (res?.data.result != null) {
        setData([res.data.result[0]]);
      } else {
        getTableList();
      }
    }
  };

  const cohortColumn: ProColumns<schema.XTarget>[] = [
    { title: '序号', valueType: 'index', width: 50 },
    { title: '账号', dataIndex: 'code' },
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
    <div className={cls.tableBox}>
      <div>
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
      <div className={cls.tableContent}>
        <ProTable<schema.XTarget>
          dataSource={data}
          rowSelection={{
            onSelect: (record: any, selected: any, selectedRows: any) => {
              console.log(record, selected, selectedRows);
              props.searchCallback(selectedRows);
            },
          }}
          cardProps={{ bodyStyle: { padding: 0 } }}
          scroll={{ y: 300 }}
          options={false}
          search={false}
          columns={cohortColumn}
          rowKey={'id'}
        />
      </div>
    </div>
  );
};

export default CohortPerson;
