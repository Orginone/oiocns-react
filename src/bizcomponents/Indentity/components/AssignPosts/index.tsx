import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Input, Tooltip } from 'antd';
import { schema } from '@/ts/base';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { resetParams } from '@/utils/tools';
interface indexType {
  searchFn: Function;
  personData?: any;
}

const MemberList: React.FC<indexType> = (props) => {
  const { searchFn, personData } = props;

  useEffect(() => {
    getTableList(1, 10);
  }, []);

  const [data, setData] = useState<schema.XTarget[]>([]);
  const [value, setValue] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const getTableList = async (page: number, pageSize: number) => {
    const data = await userCtrl.space.loadMembers(resetParams({ page, pageSize }));
    if (data.total > 0 && data.result) {
      setData(data.result);
    } else {
      setData([]);
    }
  };

  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      const res = await userCtrl.user?.searchPerson(e.target.value);
      if (res?.total > 0 && res.result) {
        setData([res.result[0]]);
      } else {
        getTableList(page, 10);
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
          dataSource={personData ?? data}
          rowSelection={{
            onSelect: (record: any, selected: any, selectedRows: any) => {
              console.log(record, selected, selectedRows);
              searchFn(selectedRows);
            },
          }}
          request={async (params) => {
            const { pageIndex, pageSize } = params;
            setPage(pageIndex);
            const res = await userCtrl.space.loadMembers(
              resetParams({ page: pageIndex, pageSize }),
            );
            if (res.result) {
              return { data: res.result, total: res.total, success: true };
            }
            return { data: [], total: 0, success: true };
          }}
          cardProps={{ bodyStyle: { padding: 0 } }}
          scroll={{ y: 300 }}
          options={false}
          search={false}
          columns={cohortColumn}
          rowKey={'id'}
          tableAlertRender={false}
        />
      </div>
    </div>
  );
};

export default MemberList;
