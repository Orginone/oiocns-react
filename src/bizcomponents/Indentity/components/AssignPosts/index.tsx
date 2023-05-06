import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import cls from './index.module.less';
import { Input, Tooltip } from 'antd';
import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';
import CardOrTableComp from '@/components/CardOrTableComp';
import { XTarget } from '@/ts/base/schema';
interface indexType {
  searchFn: Function;
  members: XTarget[];
}

const MemberList: React.FC<indexType> = (props) => {
  const { searchFn, members } = props;
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
      title: '座右铭',
      dataIndex: 'remark',
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
              <AiOutlineSearch />
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
          dataSource={members}
          params={{ filter: searchValue }}
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
