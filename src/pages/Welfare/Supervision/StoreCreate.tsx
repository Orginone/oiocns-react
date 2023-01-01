import { DatePicker, Descriptions, Input, Select } from 'antd';
import React, { useState } from 'react';
import { StoreModel } from './StoreList';

const { TextArea } = Input;

export type StoreCreateProps = {
  updateNewStore: (store: StoreModel) => void;
};

/**
 * 商店信息
 */
const StoreCreate: React.FC<StoreCreateProps> = ({ updateNewStore }) => {
  const [store, setStore] = useState<StoreModel | any>({});

  const change = (keyValue: any) => {
    const newStore = { ...store, ...keyValue };
    setStore(newStore);
    updateNewStore(newStore);
  };
  return (
    <>
      <Descriptions
        title="商店信息"
        bordered
        column={2}
        size="small"
        labelStyle={{
          textAlign: 'left',
          color: '#606266',
          width: 150,
        }}
        contentStyle={{ textAlign: 'left', color: '#606266' }}>
        <Descriptions.Item label="商店信息">
          <Input
            placeholder="请输入商店名称"
            defaultValue={store.name}
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
            defaultValue={store.welfareOrg}
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
            defaultValue={store.storageAgency}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ storageAgency: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="主营类型">
          <Input
            placeholder="请输入主营类型"
            defaultValue={store.mainBusiness}
            bordered={false}
            onChange={(e) => {
              change({ name: e.target.value });
            }}
          />
          {/* <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择主营类型"
            defaultValue={store.mainBusiness}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ mainBusiness: e.target.value });
            }}
          /> */}
        </Descriptions.Item>
        <Descriptions.Item label="次营类型">
          <Input
            placeholder="请输入次营类型"
            defaultValue={store.minorBusiness}
            bordered={false}
            onChange={(e) => {
              change({ name: e.target.value });
            }}
          />
          {/* <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择次营类型"
            defaultValue={store.minorBusiness}
            bordered={false}
            // TODO 对接下拉
            options={[]}
            onChange={(e) => {
              change({ minorBusiness: e.target.value });
            }}
          /> */}
        </Descriptions.Item>
        <Descriptions.Item label="注册时间">
          <DatePicker
            style={{ width: '100%' }}
            placeholder="注册时间"
            defaultValue={store.registerTime}
            onChange={(e) => {
              change({ registerTime: e });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系人">
          <Input
            placeholder="请输入联系人"
            defaultValue={store.contactPerson}
            bordered={false}
            onChange={(e) => {
              change({ contactPerson: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系方式">
          <Input
            placeholder="请输入联系方式"
            defaultValue={store.phone}
            bordered={false}
            onChange={(e) => {
              change({ phone: e.target.value });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="备注">
          <TextArea
            placeholder="请输入备注信息"
            defaultValue={store.remark}
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

export default StoreCreate;
