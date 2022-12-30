import { DatePicker, Descriptions, Input, Select } from 'antd';
import React, { useState } from 'react';
import { MallModel } from './MallList';

const { TextArea } = Input;

export type MallCreateProps = {
  updateNewMall: (mall: MallModel) => void;
};

/**
 * 商城信息
 */
const MallCreate: React.FC<MallCreateProps> = ({ updateNewMall }) => {
  const [mall, setMall] = useState<MallModel | any>({});

  const change = (keyValue: any) => {
    const newMall = { ...mall, ...keyValue };
    setMall(newMall);
    updateNewMall(newMall);
  };
  return (
    <>
      <Descriptions
        title="商城信息"
        bordered
        column={2}
        size="small"
        labelStyle={{
          textAlign: 'left',
          color: '#606266',
          width: 150,
        }}
        contentStyle={{ textAlign: 'left', color: '#606266' }}>
        <Descriptions.Item label="商城名称">
          <Input
            placeholder="请输入商城名称"
            defaultValue={mall.name}
            bordered={false}
            onChange={(e) => {
              change({ name: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="公益组织">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择公益组织"
            defaultValue={mall.welfareOrg}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ welfareOrg: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="仓储机构">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择仓储机构"
            defaultValue={mall.storageAgency}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ storageAgency: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="主营类型">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择主营类型"
            defaultValue={mall.mainBusiness}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ mainBusiness: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="次营类型">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择次营类型"
            defaultValue={mall.minorBusiness}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ minorBusiness: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="注册时间">
          <DatePicker
            style={{ width: '100%' }}
            placeholder="注册时间"
            defaultValue={mall.registerTime}
            onChange={(e) => {
              change({ registerTime: e });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系人">
          <Input
            placeholder="请输入联系人"
            defaultValue={mall.contactPerson}
            bordered={false}
            onChange={(e) => {
              change({ contactPerson: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系方式">
          <Input
            placeholder="请输入联系方式"
            defaultValue={mall.phone}
            bordered={false}
            onChange={(e) => {
              change({ phone: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="备注">
          <TextArea
            placeholder="请输入备注信息"
            defaultValue={mall.remark}
            bordered={false}
            onChange={(e) => {
              change({ remark: e.target.value });
            }}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default MallCreate;
