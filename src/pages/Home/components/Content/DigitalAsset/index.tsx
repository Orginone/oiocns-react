import React from 'react';

import cls from './index.module.less';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import Meta from 'antd/es/card/Meta';
import NewsList from '@/pages/Home/components/NewsList';
import SwiperWall from '@/pages/Home/components/SwiperWall';

// eslint-disable-next-line no-unused-vars
enum AssetStatus {
  // eslint-disable-next-line no-unused-vars
  SOLD_OUT = '已售罄',
}
const assetList = [
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
  {
    name: '数据资产名称',
    label: ['标签1', '标签2'],
    issuer: '数据资产发行方名称',
    issuingPlatform: '发行平台',
    count: 154,
    category: '品牌营销-数字纪念品',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    status: AssetStatus.SOLD_OUT,
  },
];

export interface DigitalAssetType {
  name: string;
  label: string[];
  issuer: string;
  issuingPlatform: string;
  count: number;
  category: string;
  status: AssetStatus;
  cover: string;
}

const AssetCard: React.FC<{ data: DigitalAssetType }> = (props) => {
  return (
    <Card className={cls.assetCard} hoverable cover={<img src={props.data.cover} />}>
      <Meta title={props.data.name}></Meta>
      <Space direction={'vertical'}>
        <Space>
          {props.data.label.map((item, index) => {
            return (
              <Tag color="#f50" key={index}>
                {item}
              </Tag>
            );
          })}
        </Space>
        <div>发行方：{props.data.issuer}</div>
        <div>发行平台：{props.data.issuingPlatform}</div>
      </Space>
    </Card>
  );
};

const DigitalAsset: React.FC = () => {
  return (
    <Row gutter={[24, 24]} className={cls.digitalAsset}>
      <Col span={16}>
        <Typography.Title level={4}>数据资产上新</Typography.Title>
        <Row gutter={[24, 24]}>
          {assetList.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <AssetCard data={item}></AssetCard>
              </Col>
            );
          })}
        </Row>
      </Col>
      <Col span={8}>
        <NewsList></NewsList>
        <SwiperWall></SwiperWall>
      </Col>
    </Row>
  );
};

export default DigitalAsset;
