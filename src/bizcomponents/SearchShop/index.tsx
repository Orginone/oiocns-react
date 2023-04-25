import React, { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import styles from './index.module.less';
import { Col, Result, Row, Space, Tag } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { CheckCard } from '@ant-design/pro-components';
import { XMarket } from '@/ts/base/schema';
import TeamIcon from '../GlobalComps/teamIcon';

type ShopSearchTableProps = {
  [key: string]: any;
  searchCallback: (target: XMarket[]) => void;
};
type MarketInfoCardProps = {
  market: XMarket;
};
/*
  弹出框表格查询
*/
const ShopSearchList: React.FC<ShopSearchTableProps> = (props) => {
  const [searchKey, setSearchKey] = useState<string>();
  const [dataSource, setDataSource] = useState<schema.XMarket[]>([]);

  const ShopCardList = () => {
    return (
      <CheckCard.Group
        bordered={false}
        multiple
        style={{ width: '100%' }}
        onChange={(value) => {
          let checkObjs: XMarket[] = [];
          for (const market of dataSource) {
            if ((value as string[]).includes(market.id)) {
              checkObjs.push(market);
            }
          }
          props.searchCallback(checkObjs);
        }}>
        <Row gutter={16} style={{ width: '100%' }}>
          {dataSource.map((item) => (
            <Col span={24} key={item.id}>
              <ShopCard key={item.id} market={item}></ShopCard>
            </Col>
          ))}
        </Row>
      </CheckCard.Group>
    );
  };

  // 单位卡片渲染
  const ShopCard: React.FC<MarketInfoCardProps> = ({ market }) => (
    <CheckCard
      bordered
      style={{ width: '100%' }}
      className={`${styles.card}`}
      avatar={
        <TeamIcon
          share={market.photo ? JSON.parse(market.photo).shareInfo : ''}
          size={60}
          preview={true}
        />
      }
      title={
        <Space>
          {market.name}
          <Tag color="blue">账号：{market.code}</Tag>
        </Space>
      }
      value={market.id}
      description={`公司简介:${market.remark}`}
    />
  );

  return (
    <div className={styles[`search-card`]}>
      <SearchInput
        value={searchKey}
        placeholder="请输入商店编码"
        onChange={(event) => {
          setSearchKey(event.target.value);
          if (event.target.value) {
            orgCtrl.user.getMarketByCode(event.target.value).then((a) => {
              setDataSource(a.result || []);
            });
          } else {
            setDataSource([]);
          }
        }}
      />

      {dataSource.length > 0 && ShopCardList()}
      {searchKey && dataSource.length == 0 && (
        <Result icon={<SmileOutlined />} title={`抱歉，没有查询到相关的结果`} />
      )}
    </div>
  );
};
export default ShopSearchList;
