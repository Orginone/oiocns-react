import React, { useEffect, useRef, useState } from 'react';
import { Descriptions } from 'antd';
import moment from 'moment';
import { AssetModel } from '@/pages/Welfare/config/model';
import useObjectUpdate from '@/hooks/useObjectUpdate';
export type IProps = {
  info: AssetModel;
};

/**
 * 仓储机构信息查看
 */
const AssetCard: React.FC<IProps> = ({ info }) => {
  return (
    <div>
      <Descriptions title="基本信息" layout="vertical" bordered={false} column={4}>
        <Descriptions.Item label="共享范围">-</Descriptions.Item>
        <Descriptions.Item label="卡片经纬度">-</Descriptions.Item>
        <Descriptions.Item label="GS1编码">-</Descriptions.Item>
        <Descriptions.Item label="资产分类">{info?.spec}</Descriptions.Item>
        <Descriptions.Item label="原值">{info?.price}</Descriptions.Item>
        <Descriptions.Item label="均价/单价(元)">{info?.price}</Descriptions.Item>
        <Descriptions.Item label="价值类型">原值</Descriptions.Item>
        <Descriptions.Item label="资产编码">{info?.code}</Descriptions.Item>
        <Descriptions.Item label="资产名称">{info?.name}</Descriptions.Item>
        <Descriptions.Item label="数量">{info?.amount}</Descriptions.Item>
        <Descriptions.Item label="取得日期">{info?.getTime}</Descriptions.Item>
        <Descriptions.Item label="开始使用日期">{info?.startUseTime}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="专属信息" layout="vertical" bordered={false}>
        <Descriptions.Item label="注册日期">-</Descriptions.Item>
        <Descriptions.Item label="保修截止日期">-</Descriptions.Item>
        <Descriptions.Item label="供应商">-</Descriptions.Item>
        <Descriptions.Item label="汽车排量">-</Descriptions.Item>
        <Descriptions.Item label="车牌号">-</Descriptions.Item>
        <Descriptions.Item label="发动机号">-</Descriptions.Item>
        <Descriptions.Item label="车辆识别代码（车架号）">-</Descriptions.Item>
        <Descriptions.Item label="车辆产地">-</Descriptions.Item>
        <Descriptions.Item label="车身颜色">-</Descriptions.Item>
        <Descriptions.Item label="车辆类型">-</Descriptions.Item>
        <Descriptions.Item label="车辆所有人">-</Descriptions.Item>
        <Descriptions.Item label="车辆行使证">-</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AssetCard;
