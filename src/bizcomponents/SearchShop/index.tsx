import React, { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { Avatar, Card, Col, Result, Row, Tag, Typography } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';
import { schema } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
type CompanySearchTableProps = {
  [key: string]: any;
};
// 商店卡片渲染

const ShopCardList = (dataSource: schema.XMarket[]) => {
  if (dataSource.length > 0) {
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
  } else {
    return (
      <Result icon={<MonitorOutlined />} title={`抱歉，没有查询到该编码相关的商店`} />
    );
  }
};
/*
  弹出框表格查询
*/
const CompanySearchList: React.FC<CompanySearchTableProps> = () => {
  const [searchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<schema.XMarket[]>([]);

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入商店编码"
        extra={`找到${dataSource?.length}家商店`}
        onChange={(event) => {
          if (event.target.value) {
            userCtrl.space.getMarketByCode(event.target.value).then((a) => {
              setDataSource(a.data.result || []);
            });
          } else {
            setDataSource([]);
          }
        }}
      />
      {ShopCardList(dataSource)}
    </div>
  );
};
export default CompanySearchList;
