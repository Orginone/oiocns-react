import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  message,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
} from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import TextArea from 'antd/lib/input/TextArea';
import { DonationFormAssetColumns } from '@/pages/Welfare/config/columns';
import { model, schema, kernel } from '@/ts/base';
import { TargetType } from '@/ts/core';
/**
 * 捐赠单信息(捐赠方申请)
 * @returns
 */
const DonationSetting: React.FC = () => {
  let formdata: any = {
    no: 'GYCSQ20220926000046',
    sponsor: '省财政厅',
    needStore: '1',
    store: '395663272721911808',
    linkman: '张三',
    phone: '13800000082',
    totalValue: 10103910,
    amount: 20,
    reason: '这是申请原因这是原因',
    remark: '这是备注信息这是备注信息这是备注信息这是备注信息',
  };
  const [stores, setStores] = useState([]);
  const parentRef = useRef<any>(null);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `物资明细`,
      key: 'assetList',
    },
  ];

  useEffect(() => {
    queryStores();
  }, []);

  const queryStores = async () => {
    let groupResult: model.ResultType<schema.XTargetArray> = await kernel.queryTargetById(
      { ids: ['395662892994793472'] },
    );
    if (groupResult.success && groupResult.data.result) {
      let group: schema.XTarget = groupResult.data.result[0];
      const companyResult = await kernel.querySubTargetById({
        page: {
          limit: 100,
          offset: 0,
          filter: '',
        },
        id: group.id,
        typeNames: [TargetType.Group],
        subTypeNames: [TargetType.Company],
      });
      if (companyResult.success && companyResult.data.result) {
        let stores: any = companyResult.data.result.map((item) => {
          return { value: item.id, label: item.name };
        });
        setStores(stores);
      }
    }
  };

  // 按钮
  const renderBtns = () => {
    return (
      <>
        <Button
          key="exportBatch"
          onClick={() => {
            message.warn('该功能尚未开放');
          }}>
          批量导出
        </Button>
      </>
    );
  };

  //Descriptions按钮
  const buttons = [
    <Button
      style={{ marginRight: '10px' }}
      key="submit"
      type="primary"
      onClick={() => {
        message.warn('该功能尚未开放');
      }}>
      审批
    </Button>,
    <Button
      key="store"
      onClick={async () => {
        message.warn('该功能尚未开放');
      }}>
      暂存
    </Button>,
    <Divider key="vertical" type="vertical" />,
    <Button
      key="backlist"
      type="link"
      onClick={async () => {
        message.warn('该功能尚未开放');
      }}>
      返回列表
    </Button>,
  ];

  // 操作内容渲染函数
  const renderOperation = (item: any): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    operations = [
      {
        key: 'remove',
        label: '移除',
        onClick: async () => {
          message.warn('该功能尚未开放');
        },
      },
    ];
    return operations;
  };

  const needStoreChange = (e: RadioChangeEvent) => {
    // formdata.needStore = e.target.value;
    // setNeedStore(needStore);
  };

  return (
    <div className={cls[`content-box`]}>
      <Card bordered={false} className={cls['content']}>
        <Descriptions
          title="公益物资捐赠审批单"
          bordered
          column={2}
          size="small"
          labelStyle={{
            textAlign: 'left',
            color: '#606266',
            width: 150,
          }}
          contentStyle={{ textAlign: 'left', color: '#606266' }}
          extra={buttons}>
          <Descriptions.Item label="单据编号">
            <Input placeholder="请输入单据编号" defaultValue={formdata.no} disabled />
          </Descriptions.Item>
          <Descriptions.Item label="发起人/单位">
            <Input
              placeholder="请选择发起人或单位"
              defaultValue={formdata.sponsor}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="是否需要仓储">
            <Radio.Group
              onChange={needStoreChange}
              defaultValue={formdata.needStore}
              disabled>
              <Radio value={'1'}>是</Radio>
              <Radio value={'0'}>否</Radio>
            </Radio.Group>
          </Descriptions.Item>
          {formdata.needStore == '1' && (
            <Descriptions.Item
              label={
                <span>
                  <span style={{ color: 'red' }}>*</span>选择仓储
                </span>
              }>
              <Select
                showSearch
                placeholder="请选择仓储地点"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                defaultValue={formdata.store}
                options={stores}
              />
            </Descriptions.Item>
          )}

          <Descriptions.Item label="联系人">
            <Input
              placeholder="请输入联系人名称"
              defaultValue={formdata.linkman}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="联系方式">
            <Input
              placeholder="请输入联系人方式"
              defaultValue={formdata.phone}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="涉及资产总值(元)">
            <InputNumber
              min={0}
              defaultValue={formdata.totalValue || 0}
              prefix="￥"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              style={{ width: '100%', backgroundColor: '#fff', border: 'none' }}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            <InputNumber min={0} defaultValue={formdata.amount || 0} disabled />
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
      </Card>
      <div className={cls['pages-wrap']}>
        <PageCard bordered={false} tabList={TitleItems} tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<any>
              dataSource={[]}
              rowKey={'id'}
              request={(page) => {
                return new Promise(function (resolve, reject) {
                  // 异步处理,处理结束后、调用resolve 或 reject
                  setTimeout(() => {
                    resolve({
                      result: [
                        {
                          id: '12345678910',
                          code: '12345678910',
                          name: '资产名称1',
                          spec: '500T',
                          amount: 100,
                          remark: '这是备注这是备注',
                        },
                        {
                          id: '12345678911',
                          code: '12345678911',
                          name: '资产名称2',
                          spec: '500T',
                          amount: 100,
                          remark: '这是备注这是备注这是备注这是备注这是备注这是备注',
                        },
                        {
                          id: '12345678912',
                          code: '12345678912',
                          name: '资产名称3',
                          spec: '500T',
                          amount: 100,
                          remark: '这是备注',
                        },
                      ],
                      offset: 0,
                      limit: 10,
                      total: 100,
                    });
                  }, 1000);
                });
              }}
              parentRef={parentRef}
              operation={renderOperation}
              tableAlertOptionRender={({
                selectedRowKeys,
                selectedRows,
                onCleanSelected,
              }: any) => {
                return (
                  <Space size={16}>
                    <a>暂存勾选</a>
                    <a onClick={onCleanSelected}>清空</a>
                  </Space>
                );
              }}
              columns={DonationFormAssetColumns}
              showChangeBtn={true}
              rowSelection={{}}
            />
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default DonationSetting;
