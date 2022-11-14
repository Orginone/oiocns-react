import React, { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { Avatar, Card, Col, Result, Row, Tag, Typography } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';
import CommonClass from '@/module/commonClass/BaseServiceClass';
import API from '@/services';
import { MarketTypes } from 'typings/marketType';
type CompanySearchTableProps = {
  [key: string]: any;
};
const Service = new CommonClass({
  nameSpace: 'searchShop',
  searchApi: API.market.searchOwn,
});
// 单位卡片渲染

const ShopCardList = (dataSource: MarketTypes.MarketType[]) => {
  return (
    <Row gutter={16}>
      {dataSource.map((item) => (
        <Col span={12} key={item.id}>
          <Card className={styles.card} style={{ width: 300, marginTop: 16 }}>
            <Card.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={item.name}
              description={<Tag color="blue">{item.code}</Tag>}
            />
            <div className={styles.description}>
              <Typography.Text>简介：{item.remark || '-'}</Typography.Text>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
/*
  弹出框表格查询
*/
const CompanySearchList: React.FC<CompanySearchTableProps> = () => {
  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<MarketTypes.MarketType[]>([]);
  // 查询数据
  const getList = async (searchKey?: string) => {
    await Service.getList({
      filter: searchKey, // || '91330304254498785G',
      page: 1,
      pageSize: 10,
    });
    setDataSource(Service.List);
  };

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入商店编码"
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
      {dataSource.length > 0 && ShopCardList(dataSource)}
      {searchKey && dataSource.length == 0 && (
        <Result icon={<MonitorOutlined />} title={`抱歉，没有查询到该编码相关的商店`} />
      )}
    </div>
  );
};
export default CompanySearchList;
