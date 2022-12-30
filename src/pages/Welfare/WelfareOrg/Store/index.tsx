import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, message, RadioChangeEvent, Space } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { AssetStoreColumns } from '@/pages/Welfare/config/columns';

/**
 * 仓库/物资列表
 * @returns
 */
const Store: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [datasource, setDatasource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [key, forceUpdate] = useObjectUpdate(datasource);
  let allData: any[] = [
    {
      id: '111',
      code: 'ZCTY20220301507866',
      name: '台式电脑',
      spec: 'II500',
      amount: 100,
      price: 50000,
      totalValue: '350.1万',
      address: '仓库A',
      description: '这是描述这是描述',
    },
    {
      id: '112',
      code: 'ZCTY20220301507866',
      name: '台式电脑',
      spec: 'II500',
      amount: 1001,
      price: 50000,
      totalValue: '350.1万',
      address: '仓库B',
      description: '这是描述这是描述',
    },
    {
      id: '113',
      code: 'ZCTY20220301507866',
      name: '台式电脑',
      spec: 'II500',
      amount: 100,
      price: 50000,
      totalValue: '350.1万',
      address: '仓库A',
      description: '这是描述这是描述',
    },
  ];
  useEffect(() => {
    setDatasource(allData);
  }, []);
  // 标题tabs页
  const TitleItems = [
    {
      tab: `tab1`,
      key: 'tab1',
    },
    {
      tab: `tab2`,
      key: 'tab2',
    },
    {
      tab: `tab3`,
      key: 'tab3',
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

  const publish = (e: any) => {
    if (selectedRows.length > 0) {
      message.warn('此处设置数据状态，功能暂未开放');
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  const dodonation = () => {
    if (selectedRows.length > 0) {
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
          onClick={publish}>
          上架
        </Button>
        <Button key="refuse" style={{ marginRight: '10px' }} onClick={dodonation}>
          捐出
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
          title={<div style={{ fontSize: '16px', fontWeight: 'bold' }}>物资列表</div>}
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
              columns={AssetStoreColumns}
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

export default Store;
