import React, { useRef, useState } from 'react';
import { Button, Divider, RadioChangeEvent, Space } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { DonationFormAssetColumns } from '@/pages/Welfare/config/columns';
/**
 * 公益捐赠审批单列表
 * @returns
 */
const DonationList: React.FC = () => {
  let formdata: any = {
    no: 'GYCSQ20220926000046',
    sponsor: '省财政厅',
    needStore: '1',
    store: '1',
    linkman: '张三',
    phone: '13800000082',
    totalValue: 10103910,
    amount: 20,
    reason: '这是申请原因这是原因',
    remark: '这是备注信息这是备注信息这是备注信息这是备注信息',
  };
  const [stores, setStores] = useState([
    {
      value: '1',
      label: '仓储机构1',
    },
    {
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
    return (
      <>
        <Button key="exportBatch" onClick={() => {}}>
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

export default DonationList;
