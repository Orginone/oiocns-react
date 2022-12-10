/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Avatar, Typography, Card, List, Result, Row, Col, Descriptions } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
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

  // 单位卡片渲染
  const personInfoList = () => {
    return (
      <Row gutter={24}>
        <CheckCard.Group
          bordered={false}
          multiple
          onChange={(value) => {
            let checkObjs: XTarget[] = [];
            for (const target of dataSource) {
              if ((value as string[]).includes(target.id)) {
                checkObjs.push(target);
              }
            }
            tableProps.searchCallback(checkObjs);
          }}>
          {dataSource.map((item) => (
            <Col span={24} key={item.id}>
              {tableProps.searchType === TargetType.Person ? (
                <PersonInfoCard key={item.id} person={item}></PersonInfoCard>
              ) : (
                <CompanyCardCard key={item.id} person={item}></CompanyCardCard>
              )}
            </Col>
          ))}
        </CheckCard.Group>
      </Row>
    );
  };

  /**
   * 人员名片
   * @param person 人员
   * @returns
   */
  const PersonInfoCard: React.FC<PersonInfoCardProps> = ({ person }) => (
    <CheckCard
      bordered={false}
      style={{ width: '100%', marginTop: '0px' }}
      className={`${styles.card}`}
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size="large" />}
      title={person.name}
      value={person.id}
      key={person.id}
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
      }
    />
  );

  // 单位卡片渲染
  const CompanyCardCard: React.FC<PersonInfoCardProps> = ({ person }) => (
    <CheckCard
      bordered={false}
      style={{ width: '100%', marginTop: '0px' }}
      className={`${styles.card}`}
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size="large" />}
      title={person.name}
      value={person.id}
      description={
        <>
          {person.code}
          <Descriptions column={2}>
            <Descriptions.Item label="公司简介" span={2}>
              {person.team?.remark}
            </Descriptions.Item>
          </Descriptions>
        </>
      }
    />
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
              // tableProps.searchCallback(res.result);
            } else {
              setDataSource([]);
            }
          }
        }}
      />

      <div>{dataSource.length > 0 && personInfoList()}</div>
      {searchKey && dataSource.length == 0 && (
        <Result icon={<SmileOutlined />} title={`抱歉，没有查询到相关的结果`} />
      )}
    </div>
  );
};

export default CompanySearchList;
