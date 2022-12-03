import { SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { Card, Input, List, Result, Tooltip } from 'antd';
import React, { useState } from 'react';
import PersonInfoCard from './../PersonInfoCard';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { XTarget } from '@/ts/base/schema';
type SearchPersonProps = {
  searchCallback: (person: XTarget) => void;
};

/**
 * 人员信息展示列表
 * @param persons 人员列表
 * @returns
 */
const personInfoList: React.FC<XTarget[]> = (persons) => (
  <Card bordered={false}>
    <List
      rowKey={'id'}
      itemLayout="horizontal"
      dataSource={persons}
      renderItem={(person: XTarget) => (
        <PersonInfoCard key={person.id} person={person}></PersonInfoCard>
      )}
    />
  </Card>
);

/**
 * 搜索人员
 * @returns
 */
const SearchPerson: React.FC<SearchPersonProps> = ({ searchCallback }) => {
  const [value, setValue] = useState<string>();
  const [persons, setPersons] = useState<XTarget[]>([]);
  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      const res = await userCtrl.User?.searchPerson(e.target.value);
      if (res?.data.result != null) {
        setPersons([res.data.result[0]]);

        searchCallback(res.data.result[0]);
      }
    }
  };

  return (
    <div className={cls['search-person-container']}>
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
      <div>{persons != [] && personInfoList(persons)}</div>
      {value && persons == [] && <Result icon={<SmileOutlined />} title="暂无此用户" />}
    </div>
  );
};

export default SearchPerson;
