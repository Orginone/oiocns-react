import { Descriptions, Input, Select } from 'antd';
import React from 'react';

const { TextArea } = Input;

/**
 * 商城信息
 */
const MallCreateAuditBill: React.FC = () => {
  const formdata: any = {};

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
        <Descriptions.Item label="单据编号">
          <Input
            placeholder="请输入单据编号"
            defaultValue={formdata.no}
            bordered={false}
          />
        </Descriptions.Item>
        <Descriptions.Item label="公益组织">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择公益组织"
            defaultValue={formdata.welfareOrg}
            bordered={false}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="商城名称">
          <Input
            placeholder="请输入商城名称"
            defaultValue={formdata.name}
            bordered={false}
          />
        </Descriptions.Item>
        <Descriptions.Item label="仓储机构">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择仓储机构"
            defaultValue={formdata.storageAgency}
            bordered={false}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="主营类型">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择主营类型"
            defaultValue={formdata.mainBusiness}
            bordered={false}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="次营类型">
          <Select
            style={{ width: '100%' }}
            showSearch
            placeholder="请选择次营类型"
            defaultValue={formdata.minorBusiness}
            bordered={false}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系人">
          <Input
            placeholder="请输入联系人"
            defaultValue={formdata.contactPerson}
            bordered={false}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系方式">
          <Input
            placeholder="请输入联系方式"
            defaultValue={formdata.phone}
            bordered={false}
          />
        </Descriptions.Item>
        <Descriptions.Item label="申请原因" span={2}>
          <TextArea
            placeholder="请输入申请原因"
            defaultValue={formdata.reason}
            bordered={false}
          />
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          <TextArea
            placeholder="请输入备注信息"
            defaultValue={formdata.remark}
            bordered={false}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default MallCreateAuditBill;
