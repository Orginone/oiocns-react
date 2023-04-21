import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { Input, Tooltip } from 'antd';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { ProColumns } from '@ant-design/pro-components';
import CardOrTableComp from '@/components/CardOrTableComp';
interface indexType {
  searchFn: Function;
  personData?: any;
}

const MemberList: React.FC<indexType> = (props) => {
  const { searchFn, personData } = props;
  const [searchValue, setSearchValue] = useState<string>('');
  const keyWordChange = async (e: any) => {
    const int = setTimeout(() => {
      if (int) {
        clearTimeout(int);
      }
      setSearchValue(e.target.value);
    }, 500);
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
          placeholder="请输入用户账号/昵称/姓名"
          suffix={
            <Tooltip title="筛选用户">
              <SearchOutlined />
            </Tooltip>
          }
          onChange={keyWordChange}
        />
      </div>
      <div className={cls.tableContent}>
        <CardOrTableComp<schema.XTarget>
          rowSelection={{
            onSelect: (record: any, selected: any, selectedRows: any) => {
              searchFn(selectedRows);
            },
          }}
          dataSource={personData ?? []}
          params={{ filter: searchValue }}
          request={
            //TODO 这里有问题
            personData
              ? undefined
              : async (params) => await orgCtrl.user.loadMembers(params)
          }
          hideOperation={true}
          scroll={{ y: 300 }}
          columns={cohortColumn}
          rowKey={'id'}
        />
      </div>
    </div>
  );
};

export default MemberList;
