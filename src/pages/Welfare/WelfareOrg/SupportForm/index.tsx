import React, { useRef, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Input,
  InputNumber,
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
import { dateFormat } from '@/utils/tools';
import moment from 'moment';
/**
 * 资助单信息(受捐方申请)
 * @returns
 */
const SupportSetting: React.FC = () => {
  let formdata: any = {
    no: 'GYCSQ2022092600035',
    applicant: '杭州电子科技大学',
    needsomething: '台式电脑',
    amount: 5000,
    useWay: '社区发放',
    useAddress: '杭州',
    expireTime: '2023-10-25',
    linkman: '张三',
    phone: '13500000000',
    store: '1',
    reason: '这是申请原因这是原因',
  };
  const [stores, setStores] = useState<any[]>([
    {
      key: '101',
      value: '1',
      label: '仓储机构1',
    },
    {
      key: '102',
      value: '2',
      label: '仓储机构2',
    },
  ]);
  // const [key, forceUpdate] = useObjectUpdate(formdata);
  const parentRef = useRef<any>(null);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `物资明细`,
      key: 'assetList',
    },
  ];

  // 按钮
  const renderBtns = () => {
    return <></>;
  };

  //Descriptions按钮
  const buttons = [
    <Button
      style={{ marginRight: '10px' }}
      key="submit"
      type="primary"
      onClick={() => {}}>
      审批
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
          title="公益资助审批单"
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
          <Descriptions.Item label="申请人/单位">
            <Input
              placeholder="请输入申请人或单位"
              defaultValue={formdata.applicant}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="需求物品">
            <Input
              placeholder="请输入需求物品"
              defaultValue={formdata.needsomething}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="需求数量">
            <InputNumber min={0} defaultValue={formdata.amount || 0} disabled />
          </Descriptions.Item>

          <Descriptions.Item label="物资使用方式">
            <Input
              placeholder="请输入物资使用方式"
              defaultValue={formdata.useWay}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="发放地址">
            <Input
              placeholder="请输入发放地址"
              defaultValue={formdata.useAddress}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item label="需求截止时间">
            <DatePicker
              disabled
              defaultValue={moment(formdata.expireTime, dateFormat)}
              format={dateFormat}
            />
          </Descriptions.Item>
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

          <Descriptions.Item label="申请原因" span={2}>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              placeholder="请输入申请原因"
              defaultValue={formdata.reason}
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

export default SupportSetting;
