/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import {
  Avatar,
  Typography,
  Card,
  List,
  Result,
  // Tooltip,
  Descriptions,
} from 'antd';

import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core';

type CompanySearchTableProps = {
  [key: string]: any;
  // 需要搜索的类型
  searchType: TargetType;
  searchCallback: (target: XTarget[]) => void;
};

type PersonInfoCardProps = {
  person: XTarget;
};

/*
  弹出框表格查询
*/
const CompanySearchList: React.FC<CompanySearchTableProps> = (props) => {
  const tableProps: CompanySearchTableProps = props;

  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<XTarget[]>([]);
  const [searchPlace, setSearchPlace] = useState<string>();

  useEffect(() => {
    switch (tableProps.searchType) {
      case TargetType.Person:
        setSearchPlace('请输入要搜索用户的账号');
        break;
      case TargetType.Company:
        setSearchPlace('请输入要查询单位的信用代码');
        break;
      case TargetType.Group:
        setSearchPlace('请输入要搜索集团的编号');
        break;
    }
  }, []);

  const personInfoList: React.FC<XTarget[]> = (persons) => (
    <Card bordered={false}>
      <List
        rowKey={'id'}
        itemLayout="horizontal"
        dataSource={persons}
        renderItem={(person: XTarget) =>
          // 判断是公司、集团还是个人
          tableProps.searchType === TargetType.Person ? (
            <PersonInfoCard key={person.id} person={person}></PersonInfoCard>
          ) : (
            <CompanyCardCard key={person.id} person={person}></CompanyCardCard>
          )
        }
      />
    </Card>
  );

  /**
   * 人员名片
   * @param person 人员
   * @returns
   */
  const PersonInfoCard: React.FC<PersonInfoCardProps> = ({ person }) => (
    <List.Item>
      <List.Item.Meta
        // TODO 改为真实用户头像
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size="large" />}
        // avatar={<Avatar size="large">{person.name.substring(0, 1)}</Avatar>}
        title={<Typography.Text>{person.name}</Typography.Text>}
        description={
          <>
            {person.code}
            <Descriptions column={2}>
              <Descriptions.Item label="昵称">{person.name}</Descriptions.Item>
              <Descriptions.Item label="手机号">{person.team?.code}</Descriptions.Item>
              <Descriptions.Item label="座右铭" span={2}>
                {person.team?.remark}
              </Descriptions.Item>
            </Descriptions>
          </>
        }></List.Item.Meta>
    </List.Item>
  );

  // 单位卡片渲染
  const CompanyCardCard: React.FC<PersonInfoCardProps> = ({ person }) => (
    <List.Item>
      <List.Item.Meta
        // TODO 改为真实用户头像
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size="large" />}
        // avatar={<Avatar size="large">{person.name.substring(0, 1)}</Avatar>}
        title={<Typography.Text>{person.name}</Typography.Text>}
        description={
          <>
            {person.code}
            <Descriptions column={2}>
              <Descriptions.Item label="备注" span={2}>
                {person.team?.remark}
              </Descriptions.Item>
            </Descriptions>
          </>
        }></List.Item.Meta>
    </List.Item>
  );

  // {suffix={
  //   <Tooltip title="搜索用户">
  //     <SearchOutlined />
  //   </Tooltip>
  // }}
  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder={searchPlace}
        // extra={`找到${dataSource?.length}家单位`}
        onChange={async (event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            let res: any;
            switch (tableProps.searchType) {
              case TargetType.Person:
                res = await userCtrl.user.searchPerson(event.target.value);
                break;
              case TargetType.Company:
                res = await userCtrl.user.searchCompany(event.target.value);
                break;
              case TargetType.Group:
                res = await userCtrl.company.searchGroup(event.target.value);
                break;
            }

            // 个人 查询公司 查询人， 公司查询集团
            if (res.total && res.result) {
              setDataSource(res.result);
              tableProps.searchCallback(res.result);
            } else {
              setDataSource([]);
            }
          }
        }}
      />

      <div>{dataSource.length > 0 && personInfoList(dataSource)}</div>
      {searchKey && dataSource.length == 0 && (
        <Result icon={<SmileOutlined />} title={`抱歉，没有查询到相关的结果`} />
      )}
    </div>
  );
};

export default CompanySearchList;
