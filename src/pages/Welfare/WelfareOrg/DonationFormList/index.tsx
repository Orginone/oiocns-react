import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, message, RadioChangeEvent, Space } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { donationfromListColumns } from '@/pages/Welfare/config/columns';

// interface IProps {
//   columns: ProColumns[];
// }
/**
 * 公益捐赠审批单列表(捐赠方申请)
 * @returns
 */
const DonationList: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [datasource, setDatasource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [key, forceUpdate] = useObjectUpdate(datasource);
  let allData: any[] = [
    {
      id: '111',
      event: '捐赠发起申请',
      describe: '这是描述这是描述',
      sponsor: '省财政厅',
      creatTime: '2017-10-31 23:12:00',
      expireTime: '2017-10-31 23:12:00',
      status: 'todo',
      handle: null,
      no: 'GYCSQ20220926000046',
      needStore: '1',
      store: '1',
      linkman: '张三',
      phone: '13800000082',
      totalValue: 10103910,
      amount: 20,
      reason: '这是申请原因这是原因',
      remark: '这是备注信息这是备注信息这是备注信息这是备注信息',
    },
    {
      id: '112',
      event: '捐赠发起申请',
      describe: '描述这是描述这是描述',
      sponsor: '张三',
      creatTime: '2017-10-31 23:12:00',
      expireTime: '2017-10-31 23:12:00',
      status: 'todo',
      handle: null,
    },
    {
      id: '113',
      event: '捐赠发起申请',
      describe: '这是描述这是描述这是描述这',
      sponsor: '省财政厅',
      creatTime: '2017-10-31 23:12:00',
      expireTime: '2017-10-31 23:12:00',
      status: 'done',
      handle: '接受捐赠',
    },
  ];
  useEffect(() => {
    setDatasource(allData);
  }, []);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `全部`,
      key: 'all',
    },
    {
      tab: `待办`,
      key: 'todo',
    },
    {
      tab: `已办`,
      key: 'done',
    },
  ];
  //tab页切换
  const onTabChange = (e: any) => {
    switch (e) {
      case 'all':
        setDatasource(allData);
        break;
      case 'todo':
        setDatasource(allData.filter((item) => item.status == 'todo'));
        break;
      case 'done':
        setDatasource(allData.filter((item) => item.status == 'done'));
        break;
    }
  };

  const refuseDonation = (e: any) => {
    let unHandleRows = selectedRows.filter((item) => !item.handle);
    if (unHandleRows.length > 0) {
      message.warn('此处设置数据状态，功能暂未开放');
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  const receciveDonation = () => {
    let unHandleRows = selectedRows.filter((item) => !item.handle);
    if (unHandleRows.length > 0) {
      message.warn('此处设置数据状态，功能暂未开放');
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  // 按钮
  const renderBtns = () => {
    return (
      <>
        <Button
          key="recieve"
          style={{ marginRight: '10px' }}
          type="primary"
          onClick={receciveDonation}>
          接受捐赠
        </Button>
        <Button key="refuse" style={{ marginRight: '10px' }} onClick={refuseDonation}>
          拒绝捐赠
        </Button>
        <Button
          key="print"
          onClick={() => {
            message.error('该功能暂未开放');
          }}>
          打印
        </Button>
      </>
    );
  };

  // 操作内容渲染函数
  const renderOperation = (item: any): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    operations = [
      {
        key: 'remove',
        label: '移除',
        onClick: async () => {
          message.warn('此功能暂未开放');
        },
      },
    ];
    return operations;
  };

  return (
    <div className={cls[`content-box`]}>
      <div className={cls['pages-wrap']}>
        <PageCard
          title={
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>公益物资捐赠审批单</div>
          }
          bordered={false}
          tabList={TitleItems}
          onTabChange={onTabChange}
          tabBarExtraContent={renderBtns()}>
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable<any>
              key={key}
              dataSource={datasource}
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
                    <a
                      onClick={() => {
                        message.warn('此功能暂未开放');
                      }}>
                      暂存勾选
                    </a>
                    <a onClick={onCleanSelected}>清空</a>
                  </Space>
                );
              }}
              columns={donationfromListColumns}
              showChangeBtn={true}
              rowSelection={{
                onSelect: (_record: any, _selected: any, selectedRows: any) => {
                  // onFinish(selectedRows);
                  setSelectedRows(selectedRows);
                },
              }}
            />
          </div>
        </PageCard>
      </div>
    </div>
  );
};

export default DonationList;
