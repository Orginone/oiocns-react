import { SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { Card, Input, List, Result, Tooltip } from 'antd';
import React, { useState } from 'react';
import { Person } from '@/module/org/index';
import PersonInfoCard from './../PersonInfoCard';
import CohortController from '@/ts/controller/cohort/index';
import cls from './index.module.less';
import person from '@/ts/core/target/person';
import { schema } from '@/ts/base';
type SearchPersonProps = {
  searchCallback: (person: schema.XTarget) => void;
  person: person;
};

/**
 * 人员信息展示列表
 * @param persons 人员列表
 * @returns
 */
const personInfoList: React.FC<Person[]> = (persons) => (
  <Card bordered={false}>
    <List
      itemLayout="horizontal"
      dataSource={persons}
      renderItem={(person: Person) => <PersonInfoCard person={person}></PersonInfoCard>}
    />
  </Card>
);

/**
 * 搜索人员
 * @returns
 */
const SearchPerson: React.FC<SearchPersonProps> = ({ searchCallback, person }) => {
  const [value, setValue] = useState<string>();
  const [persons, setPersons] = useState<Person[]>([]);
  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      const res = await CohortController.searchPerson(person, e.target.value);
      console.log(res);
      if (res.data.result != null) {
        setPersons(res.data.result);
        searchCallback(res.data.result[0]);
      }
      console.log('length', persons);
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
