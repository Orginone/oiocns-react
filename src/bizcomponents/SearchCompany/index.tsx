import React, { useState, useEffect } from 'react';
import { Avatar, Card, Col, Result, Row, Tag, Typography, Button } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';

import { XTarget } from '@/ts/base/schema';
import PersonController from '@/pages/Person/_control/personcontroller';

import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';

type CompanySearchTableProps = {
  [key: string]: any;
  setJoinKey?: (key: string) => void;
};

let tableProps: CompanySearchTableProps;

/* 
  弹出框表格查询
*/
const CompanySearchList: React.FC<CompanySearchTableProps> = (props) => {

  type dataObject = XTarget & {
    selectStyle: string;
  }

  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<XTarget[]>([]);

  useEffect(() => {
    tableProps = props;
  }, []);


  // 单位卡片渲染
  const companyCardList = () => {
    return (
      <Row gutter={16}>
        {dataSource.map((item) => (
          <Col span={12} key={item.id}>
            <Card
              className={`${styles.card} ${styles[(item as dataObject).selectStyle]}`} >
              <Card.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={item.name}
                description={<Tag color="blue">{item.code}</Tag>}
              />
              <div className={styles.description}>
                <Typography.Text>简介：{item.team.remark || '-'}</Typography.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // 查询数据
  const getList = (searchKey?: string) => {
    PersonController.getInstance().createCompany();

    PersonController.getInstance().searchCompany({
      page: 1,
      pageSize: 10,
      filter: searchKey, // || '91330304254498785G',
    }, (data: any) => {
      // 回调
      if (data.success) {
        setDataSource(data.data);
        if (data.data.length > 0) {
          if (tableProps.setJoinKey)
            tableProps.setJoinKey(data.data[0].id);
        }
      }

    });

  };

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入单位编码"
        // extra={`找到${dataSource?.length}家单位`}
        onChange={(event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            getList(event.target.value);
          } else {
            setDataSource([]);
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
