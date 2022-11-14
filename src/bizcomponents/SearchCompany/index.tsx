import React, { useState, useEffect } from 'react';
import { Company } from '@/module/org';
import CompanyServices from '@/module/org/company';
import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { Avatar, Card, Col, Result, Row, Tag, Typography, Button } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';

type CompanySearchTableProps = {
  [key: string]: any;
  setJoinKey?: (key: string) => void;
};

let tableProps: CompanySearchTableProps;

/* 
  弹出框表格查询
*/
const CompanySearchList: React.FC<CompanySearchTableProps> = (props) => {
  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<Company[]>([]);

  useEffect(() => {
    tableProps = props;
  }, []);

  const doSelectOne = (target: any, item: Company) => {
    // target.preventDefault();
    if (tableProps.setJoinKey) tableProps.setJoinKey(item.id);

    // 选中的样式
    dataSource.map((e) => {
      if (e.id === item.id) {
        e.selectStyle = 'company-select-type';
      } else {
        e.selectStyle = 'company-no-select-type';
      }
    });
  };
  // 单位卡片渲染
  const companyCardList = () => {
    return (
      <Row gutter={16}>
        {dataSource.map((item) => (
          <Col span={12} key={item.id}>
            <Card
              className={`${styles.card} ${styles[item.selectStyle]}`}
              actions={[
                <Button
                  key="{item.id}+'_1'"
                  onClick={(e) => doSelectOne(e, item)}
                  type="primary">
                  选中
                </Button>,
              ]}>
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
  const getList = async (searchKey?: string) => {
    const { data } = await CompanyServices.searchCompany({
      filter: searchKey, // || '91330304254498785G',
      page: 1,
      pageSize: 10,
    });
    setDataSource(data);
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
