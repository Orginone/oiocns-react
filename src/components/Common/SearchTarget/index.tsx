/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { AiOutlineSmile } from '@/icons/ai';
import { Result, Row, Col, Descriptions, Space, Tag } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { XTarget } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { TargetType, companyTypes } from '@/ts/core';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';

type CompanySearchTableProps = {
  [key: string]: any;
  autoSelect?: boolean;
  searchType: TargetType;
  searchCallback: (target: XTarget[]) => void;
};

/*
  弹出框表格查询
*/
const SearchTarget: React.FC<CompanySearchTableProps> = (props) => {
  const tableProps: CompanySearchTableProps = props;
  const [checked, setChecked] = useState<string[]>([]);

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
        setSearchPlace('请输入组织集群的编码');
        break;
      case TargetType.Cohort:
        setSearchPlace('请输入群组的编码');
        break;
    }
  }, [props]);

  // 单位卡片渲染
  const personInfoList = () => {
    return (
      <CheckCard.Group
        bordered={false}
        multiple
        value={checked}
        style={{ width: '100%' }}
        onChange={(value: any) => {
          setChecked(value);
          let checkObjs: XTarget[] = [];
          for (const target of dataSource) {
            if (value.includes(target.id)) {
              checkObjs.push(target);
            }
          }
          tableProps.searchCallback(checkObjs);
        }}>
        <Row gutter={16} style={{ width: '100%' }}>
          {dataSource.map((target) => (
            <Col span={24} key={target.id}>
              <CheckCard
                bordered
                style={{ width: '100%' }}
                className={`${styles.card}`}
                avatar={<TeamIcon entityId={target.id} size={60} />}
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
                    <Descriptions.Item label="简介" span={2}>
                      {target.remark}
                    </Descriptions.Item>
                  </Descriptions>
                }
              />
            </Col>
          ))}
        </Row>
      </CheckCard.Group>
    );
  };

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder={searchPlace}
        onChange={async (event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            const res: XTarget[] = [];
            switch (tableProps.searchType) {
              case TargetType.Person:
                res.push(
                  ...(await orgCtrl.user.searchTargets(event.target.value, [
                    TargetType.Person,
                  ])),
                );
                break;
              case TargetType.Company:
              case TargetType.University:
              case TargetType.Hospital:
                res.push(
                  ...(await orgCtrl.user.searchTargets(event.target.value, companyTypes)),
                );
                break;
              case TargetType.Group:
                res.push(
                  ...(await orgCtrl.user.searchTargets(event.target.value, [
                    TargetType.Group,
                  ])),
                );
                break;
              case TargetType.Cohort:
                res.push(
                  ...(await orgCtrl.user.searchTargets(event.target.value, [
                    TargetType.Cohort,
                  ])),
                );
                break;
              case TargetType.Storage:
                res.push(
                  ...(await orgCtrl.user.searchTargets(event.target.value, [
                    TargetType.Storage,
                  ])),
                );
                break;
            }
            setDataSource(res);
            if (props.autoSelect) {
              setChecked(res.map((i) => i.id));
              tableProps.searchCallback(res);
            }
          }
        }}
      />

      {dataSource.length > 0 && personInfoList()}
      {searchKey && dataSource.length == 0 && (
        <Result icon={<AiOutlineSmile />} title={`抱歉，没有查询到相关的结果`} />
      )}
    </div>
  );
};

export default SearchTarget;
