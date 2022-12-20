import { Descriptions } from 'antd';
import React from 'react';

export type DonationBillType = {
  billNo: string;
  teamName: string;
  teamCode: string;
  isNeedStore: boolean;
  contactPerson: string;
  phone: string;
  totalPrice: number;
  amount: number;
  remark: string;
};

/**
 * 捐赠单
 */
const DonationBill: React.FC<DonationBillType> = () => {
  return (
    <div>
      <Descriptions title="捐赠单据" bordered column={2}>
        <Descriptions.Item label="单据编号">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="公益组织">Prepaid</Descriptions.Item>
        <Descriptions.Item label="受捐单位机构代码">YES</Descriptions.Item>
        <Descriptions.Item label="是否需要仓储">2018-04-24 18:00:00</Descriptions.Item>
        <Descriptions.Item label="联系人">2019-04-24 18:00:00</Descriptions.Item>
        <Descriptions.Item label="联系方式">$80.00</Descriptions.Item>
        <Descriptions.Item label="涉及资产总值">$20.00</Descriptions.Item>
        <Descriptions.Item label="数量">$60.00</Descriptions.Item>
        <Descriptions.Item label="申请原因" span={2}>
          Data disk type: MongoDB
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          Data disk type: MongoDB
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default DonationBill;
