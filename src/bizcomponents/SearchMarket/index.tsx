import { SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Col, Input, Result, Row, Space, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import styles from './index.module.less';
import userCtrl from '@/ts/controller/setting';
import { XMarket } from '@/ts/base/schema';
import { CheckCard } from '@ant-design/pro-components';
import SearchInput from '@/components/SearchInput';
type SearchMarketProps = {
  searchCallback: (markets: XMarket[]) => void;
};

/**
 * 搜索商店
 * @returns
 */
const SearchMarket: React.FC<SearchMarketProps> = ({ searchCallback }) => {
  const [value, setValue] = useState<string>();
  const [markets, setMarkets] = useState<XMarket[]>([]);

  const keyWordChange = async (e: any) => {
    setValue(e.target.value);
    if (e.target.value) {
      const res = await userCtrl.space.getMarketByCode(e.target.value);
      if (res.result) {
        setMarkets(res.result);
        searchCallback(res.result);
      } else {
        setMarkets([]);
      }
    }
  };

  /**
   * 商店名片
   * @param market 商店
   * @returns
   */
  const MarketInfoCard = (market: XMarket) => {
    return (
      <CheckCard
        bordered
        style={{ width: '100%' }}
        className={`${styles.card}`}
        avatar={
          <Avatar
            src={
              market.photo
                ? JSON.parse(market.photo)?.thumbnail
                : 'https://joeschmoe.io/api/v1/random'
            }
            size={60}
          />
        }
        title={
          <Space>
            {market.name}
            <Tag color="blue">编号：{market.code}</Tag>
          </Space>
        }
        value={market}
        description={`公司简介:${market.remark}`}
      />
    );
  };
  /**
   * 商店信息展示列表
   * @param markets 商店列表
   * @returns
   */
  const MarketInfoList = () => {
    return (
      <CheckCard.Group
        bordered={false}
        multiple
        style={{ width: '100%' }}
        onChange={(value) => {
          let checkObjs: XMarket[] = [];
          for (const target of markets) {
            if ((value as string[]).includes(target.id)) {
              checkObjs.push(target);
            }
          }
          searchCallback(checkObjs);
        }}>
        <Row gutter={16} style={{ width: '100%' }}>
          {markets.map((item) => (
            <Col span={12} key={item.id}>
              {MarketInfoCard(item)}
            </Col>
          ))}
        </Row>
      </CheckCard.Group>
    );
  };
  return (
    <div className={styles[`search-card`]}>
      <SearchInput placeholder="请输入商店编号" value={value} onChange={keyWordChange} />
      <div>{markets.length > 0 && MarketInfoList()}</div>
      {value && markets.length === 0 && (
        <Result icon={<SmileOutlined />} title="未找到商店" />
      )}
    </div>
  );
};

export default SearchMarket;
