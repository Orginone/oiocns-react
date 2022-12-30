import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Descriptions,
  Divider,
  message,
  Modal,
  RadioChangeEvent,
  Space,
} from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { AssetColumns } from '@/pages/Welfare/config/columns';

/**
 * 商店/物资列表
 * @returns
 */
const Market: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [datasource, setDatasource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [key, forceUpdate] = useObjectUpdate(datasource);
  const [openModal, setOpenModal] = useState<boolean>(false);
  let allData: any[] = [
    {
      id: '111',
      code: 'ZCTY20220301507866',
      name: '台式电脑',
      spec: 'II500',
      amount: 100,
      price: 50000,
      totalValue: '350.1万',
      welfareOrg: '省红十字会',
      storageAgency: '仓储A',
      address: '商店A',
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
      welfareOrg: '公益基金会',
      storageAgency: '浙江省1号公益仓',
      address: '商店B',
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
      welfareOrg: '省红十字会',
      storageAgency: '仓储A',
      address: '商店A',
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

  const publishfromstore = (e: any) => {
    message.warn('该功能尚未开放');
  };

  const unpublish = () => {
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
          onClick={publishfromstore}>
          从仓库添加
        </Button>
        <Button key="refuse" style={{ marginRight: '10px' }} onClick={unpublish}>
          下架
        </Button>
      </>
    );
  };

  // 操作内容渲染函数
  const renderOperation = (item: any): common.OperationType[] => {
    let operations: common.OperationType[] = [];
    operations = [
      {
        key: 'opencard',
        label: '资产卡片',
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
          title={<div style={{ fontSize: '16px', fontWeight: 'bold' }}>物资清单</div>}
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
              columns={AssetColumns}
              showChangeBtn={true}
              rowSelection={{
                onSelect: (_record: any, _selected: any, selectedRows: any) => {
                  setSelectedRows(selectedRows);
                },
              }}
            />
          </div>
        </PageCard>
        <Modal
          title="资产卡片"
          open={openModal}
          onOk={() => {
            setOpenModal(false);
          }}
          onCancel={() => {
            setOpenModal(false);
          }}
          okText="下载"
          width={1000}>
          {' '}
          <Descriptions title="基本信息" layout="vertical" bordered={false} column={4}>
            <Descriptions.Item label="共享范围">-</Descriptions.Item>
            <Descriptions.Item label="卡片经纬度">-</Descriptions.Item>
            <Descriptions.Item label="GS1编码">-</Descriptions.Item>
            <Descriptions.Item label="资产分类">载货汽车(含自卸汽车)</Descriptions.Item>
            <Descriptions.Item label="原值">2870</Descriptions.Item>
            <Descriptions.Item label="均价/单价(元)">-</Descriptions.Item>
            <Descriptions.Item label="价值类型">原值</Descriptions.Item>
            <Descriptions.Item label="资产编码">ZCFW20210800006097</Descriptions.Item>
            <Descriptions.Item label="资产名称">载货汽车(含自卸汽车)</Descriptions.Item>
            <Descriptions.Item label="数量">1</Descriptions.Item>
            <Descriptions.Item label="取得日期">2020-02-28</Descriptions.Item>
            <Descriptions.Item label="开始使用日期">2020-02-28</Descriptions.Item>
          </Descriptions>
          <Descriptions title="专属信息" layout="vertical" bordered={false}>
            <Descriptions.Item label="注册日期">-</Descriptions.Item>
            <Descriptions.Item label="保修截止日期">-</Descriptions.Item>
            <Descriptions.Item label="供应商">-</Descriptions.Item>
            <Descriptions.Item label="汽车排量">-</Descriptions.Item>
            <Descriptions.Item label="车牌号">-</Descriptions.Item>
            <Descriptions.Item label="发动机号">-</Descriptions.Item>
            <Descriptions.Item label="车辆识别代码（车架号）">-</Descriptions.Item>
            <Descriptions.Item label="车辆产地">-</Descriptions.Item>
            <Descriptions.Item label="车身颜色">-</Descriptions.Item>
            <Descriptions.Item label="车辆类型">-</Descriptions.Item>
            <Descriptions.Item label="车辆所有人">-</Descriptions.Item>
            <Descriptions.Item label="车辆行使证">-</Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    </div>
  );
};

export default Market;
