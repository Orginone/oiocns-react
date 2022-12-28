import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Dropdown,
  Input,
  InputNumber,
  MenuProps,
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
import userCtrl from '@/ts/controller/setting';
import IMarket from '@/ts/core/market/imarket';
import { DownOutlined } from '@ant-design/icons';
/**
 * 上架物资（公益组织）
 * @returns
 */
const PublishAssetSetting: React.FC = () => {
  let formdata: any = {
    no: null,
    sponsor: userCtrl.company.name,
    market: null, //上架商城
    store: null,
    needAssess: '1', //是否需要评估
    netWorth: 0, //净值
    totalValue: 0, //总值
    amount: 0,
    reason: null,
    remark: null,
  };
  const [stores, setStores] = useState<common.OptionType[]>([
    {
      value: '1',
      label: '仓储机构1',
    },
    {
      value: '2',
      label: '仓储机构2',
    },
  ]);
  const [markets, setMarkets] = useState<common.OptionType[]>([]);
  useEffect(() => {
    getMarkets();
  }, [userCtrl.company]);

  const getMarkets = async () => {
    var joinedMarkets: IMarket[] = await userCtrl.company.getJoinMarkets();
    setMarkets(
      joinedMarkets.map((item: IMarket) => {
        return { value: item.market.id, label: item.market.name };
      }),
    );
  };
  // const [key, forceUpdate] = useObjectUpdate(formdata);
  const parentRef = useRef<any>(null);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `物资明细`,
      key: 'assetList',
    },
  ];

  const items: MenuProps['items'] = [
    {
      label: '暂存箱添加',
      key: '1',
      onClick: () => {
        console.log('暂存箱添加');
      },
    },
    {
      label: '仓库添加',
      key: '2',
      onClick: () => {
        console.log('仓库添加');
      },
    },
  ];

  // 按钮
  const renderBtns = () => {
    return (
      <>
        <Dropdown menu={{ items }}>
          <Button style={{ marginRight: '10px' }} key="addAsset" type="primary">
            <Space>
              添加资产
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Button key="exportBatch" onClick={() => {}}>
          批量导入/导出
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
      onClick={() => {}}>
      提交并审核
    </Button>,
    <Button key="store" onClick={async () => {}}>
      暂存
    </Button>,
    <Divider key="vertical" type="vertical" />,
    <Button key="backlist" type="link" onClick={async () => {}}>
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
        onClick: async () => {},
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
          title="公益仓上架申请单"
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
            <Input placeholder="请输入单据编号" defaultValue={formdata.no} />
          </Descriptions.Item>
          <Descriptions.Item label="发起人/单位">
            <Input
              placeholder="请选择发起人或单位"
              defaultValue={formdata.sponsor}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="上架商城">
            <Select
              showSearch
              placeholder="请选择上架商城"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              defaultValue={formdata.market}
              options={markets}
            />
          </Descriptions.Item>

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

          <Descriptions.Item label="是否评估">
            <Radio.Group defaultValue={formdata.needAssess}>
              <Radio value={'1'}>是</Radio>
              <Radio value={'0'}>否</Radio>
            </Radio.Group>
          </Descriptions.Item>
          <Descriptions.Item label="净值合计(元)">
            <InputNumber
              min={0}
              defaultValue={formdata.netWorth || 0}
              prefix="￥"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              style={{ width: '100%', backgroundColor: '#fff', border: 'none' }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="涉及资产总值(元)">
            <InputNumber
              min={0}
              defaultValue={formdata.totalValue || 0}
              prefix="￥"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              style={{ width: '100%', backgroundColor: '#fff', border: 'none' }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            <InputNumber min={0} defaultValue={formdata.amount || 0} />
          </Descriptions.Item>
          <Descriptions.Item label="申请原因" span={2}>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="请输入申请原因"
              defaultValue={formdata.reason}
            />
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="请输入备注信息"
              defaultValue={formdata.remark}
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

export default PublishAssetSetting;
