import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, message, Modal, RadioChangeEvent, Space, Tabs } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import {
  dodonationListColumns_Processed,
  dodonationListColumns_Supported,
} from '@/pages/Welfare/config/columns';

/**
 * 捐赠列表(公益组织发起)
 * @returns
 */
const DoDonationList: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [datasource, setDatasource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [key, forceUpdate] = useObjectUpdate(datasource);
  const [currentTab, setCurrentTab] = useState<string>('Draft');
  const [columns, setColumns] = useState<ProColumns[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  let allData: any[] = [
    {
      id: '111',
      no: 'GYCSQ20220926000046',
      name: '台式电脑',
      donors: '杭州电子科技大学',
      amount: 100,
      linkman: '张三',
      phone: '13800000082',
      status: '关闭',
      assetStatus: '受捐单位入库',
    },
    {
      id: '112',
      no: 'GYCSQ20220926000046',
      name: '台式电脑',
      donors: '杭州电子科技大学',
      amount: 100,
      linkman: '张三',
      phone: '13800000082',
      status: '接受',
      assetStatus: '受捐单位签收',
    },
    {
      id: '113',
      no: 'GYCSQ20220926000046',
      name: '台式电脑',
      donors: '杭州电子科技大学',
      amount: 100,
      linkman: '张三',
      phone: '13800000082',
      status: '拒绝',
      assetStatus: '受捐单位签收',
    },
  ];
  useEffect(() => {
    setDatasource(allData);
    setColumns(dodonationListColumns_Processed);
  }, []);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `草稿`,
      key: 'Draft',
    },
    {
      tab: `已送审`,
      key: 'Processing',
    },
    {
      tab: `已审核`,
      key: 'Processed',
    },
    {
      tab: `已资助`,
      key: 'Supported',
    },
  ];
  //tab页切换
  const onTabChange = (e: any) => {
    setCurrentTab(e);
    switch (e) {
      case 'Draft':
        // setDatasource(allData);
        break;
      case 'Processing':
        // setDatasource(allData.filter((item) => item.status == 'todo'));
        break;
      case 'Processed':
        // setDatasource(allData.filter((item) => item.status == 'done'));
        setColumns(dodonationListColumns_Processed);
        break;
      case 'Supported':
        // setDatasource(allData.filter((item) => item.status == 'done'));
        setColumns(dodonationListColumns_Supported);
        break;
    }
  };

  const pop = () => {
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
      currentTab === 'Processed' && (
        <Button
          key="recieve"
          style={{ marginRight: '10px' }}
          type="primary"
          onClick={pop}>
          出库
        </Button>
      )
    );
  };

  // 操作内容渲染函数
  const renderOperation = (item: any): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    operations = [
      {
        key: 'detail',
        label: '单据详情',
        onClick: async () => {
          // message.warn('此功能暂未开放');
          setOpenModal(true);
        },
      },
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
          title={<div style={{ fontSize: '16px', fontWeight: 'bold' }}>捐赠列表</div>}
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
              columns={columns}
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
        <Modal
          title={
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  label: `单据编号`,
                  key: '1',
                  children: `Content of Tab Pane 1`,
                },
                {
                  label: `流程跟踪`,
                  key: '2',
                  children: `Content of Tab Pane 2`,
                },
              ]}
            />
          }
          open={openModal}
          width={1000}
          footer={[]}
          onOk={() => setOpenModal(false)}
          onCancel={() => setOpenModal(false)}></Modal>
      </div>
    </div>
  );
};

export default DoDonationList;
