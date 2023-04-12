/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Result, Row, Col, Descriptions, Space, Tag } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { TargetType } from '@/ts/core';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import Person from '@/ts/core/target/person';
import Company from '@/ts/core/target/company';

type CompanySearchTableProps = {
  [key: string]: any;
  // 需要搜索的类型
  searchType: TargetType;
  searchCallback: (target: XTarget[]) => void;
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
        setSearchPlace('请输入用户的账号');
        break;
      case TargetType.Company:
        setSearchPlace('请输入单位的社会统一信用代码');
        break;
      case TargetType.Group:
        setSearchPlace('请输入集团的编码');
        break;
      case TargetType.Cohort:
        setSearchPlace('请输入群组的编码');
        break;
    }
  }, []);

  // 单位卡片渲染
  const personInfoList = () => {
    return (
      <CheckCard.Group
        bordered={false}
        multiple
        style={{ width: '100%' }}
        onChange={(value: string[]) => {
          let checkObjs: XTarget[] = [];
          for (const target of dataSource) {
            if (value.includes(target.id)) {
              checkObjs.push(target);
            }
          }
          tableProps.searchCallback(checkObjs);
        }}>
        <Row gutter={16} style={{ width: '100%' }}>
          {dataSource.map((item) => (
            <Col span={24} key={item.id}>
              {tableProps.searchType === TargetType.Person && (
                <PersonCard key={item.id} target={item} />
              )}
              {tableProps.searchType === TargetType.Cohort && (
                <CohortCard key={item.id} target={item} />
              )}
              {tableProps.searchType === TargetType.Group && (
                <GroupCard key={item.id} target={item} />
              )}
              {[
                TargetType.Company,
                TargetType.University,
                TargetType.Hospital,
                TargetType.Research,
              ].includes(tableProps.searchType) && (
                <CompanyCard key={item.id} target={item} />
              )}
            </Col>
          ))}
        </Row>
      </CheckCard.Group>
    );
  };

  /**
   * 人员名片
   * @param person 人员
   * @returns
   */
  const PersonCard: React.FC<{ target: XTarget }> = ({ target }) => (
    <CheckCard
      bordered
      style={{ width: '100%' }}
      className={`${styles.card}`}
      avatar={<TeamIcon share={new Person(target).shareInfo} size={60} preview={true} />}
      title={
        <Space>
          {target.name}
          <Tag color="blue">账号：{target.code}</Tag>
        </Space>
      }
      value={target.id}
      key={target.id}
      description={
        <Descriptions column={2} size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="姓名">{target.team?.name}</Descriptions.Item>
          <Descriptions.Item label="手机号">{target.team?.code}</Descriptions.Item>
          <Descriptions.Item label="座右铭" span={2}>
            {target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      }
    />
  );

  /**
   * 群组名片
   * @param person 人员
   * @returns
   */
  const CohortCard: React.FC<{ target: XTarget }> = ({ target }) => (
    <CheckCard
      bordered
      style={{ width: '100%' }}
      className={`${styles.card}`}
      avatar={<TeamIcon share={new Person(target).shareInfo} size={60} preview={true} />}
      title={
        <Space>
          {target.name}
          <Tag color="blue">编号：{target.code}</Tag>
        </Space>
      }
      value={target.id}
      key={target.id}
      description={
        <Descriptions column={2} size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="群名称">{target.team?.name}</Descriptions.Item>
          <Descriptions.Item label="群编号">{target.team?.code}</Descriptions.Item>
          <Descriptions.Item label="群签名" span={2}>
            {target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      }
    />
  );

  // 单位卡片渲染
  const CompanyCard: React.FC<{ target: XTarget }> = ({ target }) => (
    <CheckCard
      bordered
      style={{ width: '100%' }}
      className={`${styles.card}`}
      avatar={
        <TeamIcon
          share={new Company(target, userCtrl.user.id).shareInfo}
          size={60}
          preview={true}
        />
      }
      title={
        <Space>
          {target.name}
          <Tag color="blue">统一社会信用代码：{target.code}</Tag>
        </Space>
      }
      value={target.id}
      description={`公司简介:${target.team?.remark}`}
    />
  );

  // 集团卡片渲染
  const GroupCard: React.FC<{ target: XTarget }> = ({ target }) => (
    <CheckCard
      bordered
      style={{ width: '100%' }}
      className={`${styles.card}`}
      avatar={
        <TeamIcon
          share={new Company(target, userCtrl.user.id).shareInfo}
          size={60}
          preview={true}
        />
      }
      title={
        <Space>
          {target.name}
          <Tag color="blue">集团编码：{target.code}</Tag>
        </Space>
      }
      value={target.id}
      description={`集团简介:${target.team?.remark}`}
    />
  );

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder={searchPlace}
        onChange={async (event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            let res: any;
            switch (tableProps.searchType) {
              case TargetType.Person:
                res = await userCtrl.user.searchPerson(event.target.value);
                break;
              case TargetType.Company:
              case TargetType.University:
              case TargetType.Hospital:
                res = await userCtrl.user.searchCompany(event.target.value);
                break;
              case TargetType.Group:
                res = await userCtrl.company.searchGroup(event.target.value);
                break;
              case TargetType.Cohort:
                res = await userCtrl.user.searchCohort(event.target.value);
                break;
            }
            // 个人 查询公司 查询人， 公司查询集团
            if (res.total && res.result) {
              setDataSource(res.result);
            } else {
              setDataSource([]);
            }
          }
        }}
      />

      {dataSource.length > 0 && personInfoList()}
      {searchKey && dataSource.length == 0 && (
        <Result icon={<SmileOutlined />} title={`抱歉，没有查询到相关的结果`} />
      )}
    </div>
  );
};

export default CompanySearchList;
