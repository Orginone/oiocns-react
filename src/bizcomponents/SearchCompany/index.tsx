import React, { useState, useEffect } from 'react';
import { Avatar, Card, Col, Result, Row, Tag, Typography } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';

import { XTarget } from '@/ts/base/schema';

import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';

type CompanySearchTableProps = {
  [key: string]: any;
  setJoinKey?: (key: string) => void;
  setJoinTarget?: (target: schema.XTarget) => void;
};

let tableProps: CompanySearchTableProps;

/*
  弹出框表格查询
*/
const CompanySearchList: React.FC<CompanySearchTableProps> = (props) => {
  type dataObject = XTarget & {
    selectStyle: string;
  };

  useEffect(() => {
    tableProps = props;
  }, []);

  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<XTarget[]>([]);

  // 单位卡片渲染
  const companyCardList = () => {
    return (
      <Row gutter={16}>
        {dataSource.map((item) => (
          <Col span={12} key={item.id}>
            <Card
              className={`${styles.card} ${styles[(item as dataObject).selectStyle]}`}>
              <Card.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={item.name}
                description={<Tag color="blue">{item.code}</Tag>}
              />
              <div className={styles.description}>
                <Typography.Text>简介：{item.team?.remark || '-'}</Typography.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入单位编码"
        // extra={`找到${dataSource?.length}家单位`}
        onChange={async (event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            const res = await userCtrl.user.searchCompany(event.target.value);
            if (res.success && res.data && res.data.result) {
              setDataSource(res.data.result);
              const joinKey = res.data.result[0].id!;
              if (tableProps.setJoinKey) {
                tableProps.setJoinKey(joinKey);
              }
              if (tableProps.setJoinTarget) {
                tableProps.setJoinTarget(res.data.result[0]);
              }
            }
          }
        }}
      />

      {dataSource.length > 0 && companyCardList()}
      {searchKey && dataSource.length == 0 && (
        <Result icon={<MonitorOutlined />} title={`抱歉，没有查询到该编码相关的单位`} />
      )}
    </div>
  );
};

export default CompanySearchList;
