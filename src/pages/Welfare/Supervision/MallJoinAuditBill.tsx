import { Button, Descriptions, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

/**
 * 商城信息
 */
const MallJoinAuditBill: React.FC = () => {
  const formdata: any = {};
  const operateButtons = [
    <Button
      style={{ marginRight: '10px' }}
      key="submit"
      type="primary"
      onClick={() => {}}>
      提交
    </Button>,
    <Button key="store" onClick={async () => {}}>
      暂存
    </Button>,
    <Button key="backlist" type="link" onClick={async () => {}}>
      返回列表
    </Button>,
  ];

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
        contentStyle={{ textAlign: 'left', color: '#606266' }}
        extra={operateButtons}>
        <Descriptions.Item label="单据编号">
          <Input placeholder="请输入单据编号" defaultValue={formdata.no} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="公益组织">
          <Select
            showSearch
            placeholder="请选择公益组织"
            defaultValue={formdata.welfareOrg}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="商城名称">
          <Input placeholder="请输入商城名称" defaultValue={formdata.name} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="仓储机构">
          <Select
            showSearch
            placeholder="请选择仓储机构"
            defaultValue={formdata.storageAgency}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="主营类型">
          <Select
            showSearch
            placeholder="请选择主营类型"
            defaultValue={formdata.mainBusiness}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="次营类型">
          <Select
            showSearch
            placeholder="请选择次营类型"
            defaultValue={formdata.minorBusiness}
            options={[]}
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系人">
          <Input
            placeholder="请输入联系人"
            defaultValue={formdata.contactPerson}
            disabled
          />
        </Descriptions.Item>
        <Descriptions.Item label="联系方式">
          <Input placeholder="请输入联系方式" defaultValue={formdata.phone} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="申请原因" span={2}>
          <TextArea
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="请输入申请原因"
            defaultValue={formdata.reason}
            disabled
          />
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          <TextArea
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="请输入备注信息"
            defaultValue={formdata.remark}
            disabled
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default MallJoinAuditBill;
