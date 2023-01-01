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
import DonationForm from '@/pages/Welfare/WelfareOrg/WelfareMarket/DonationForm';
import SupportForm from '@/pages/Welfare/WelfareOrg/WelfareMarket/SupportForm';
import { getUuid } from '@/utils/tools';
import { Status } from '../../config/status';
import userCtrl from '@/ts/controller/setting';
import AssetCard from '@/pages/Welfare/WelfareOrg/WelfareMarket/AssetCard';
/**
 * 公益商店
 * @returns
 */
const WelfareMarket: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [datasource, setDatasource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [key, forceUpdate] = useObjectUpdate(datasource);
  const [openAssetCard, setOpenAssetCard] = useState<any>(null);
  const [openDonationform, setOpenDonationform] = useState<boolean>(false);
  const [openSupportform, setOpenSupportform] = useState<boolean>(false);
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

  const publish = (e: any) => {
    setOpenDonationform(true);
  };

  const unpublish = () => {
    if (selectedRows.length > 0) {
      setOpenSupportform(true);
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
          捐赠上架
        </Button>
        <Button key="refuse" style={{ marginRight: '10px' }} onClick={unpublish}>
          申领下架
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
          setOpenAssetCard(item);
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
        {!openDonationform && !openSupportform && (
          <PageCard
            title={<div style={{ fontSize: '16px', fontWeight: 'bold' }}>公益商城</div>}
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
        )}
        <Modal
          title="资产卡片"
          open={openAssetCard}
          onOk={() => {
            setOpenAssetCard(null);
          }}
          onCancel={() => {
            setOpenAssetCard(null);
          }}
          okText="下载"
          width={1000}>
          {' '}
          <AssetCard info={openAssetCard}></AssetCard>
          {/* <Descriptions title="基本信息" layout="vertical" bordered={false} column={4}>
            <Descriptions.Item label="共享范围">-</Descriptions.Item>
            <Descriptions.Item label="卡片经纬度">-</Descriptions.Item>
            <Descriptions.Item label="GS1编码">-</Descriptions.Item>
            <Descriptions.Item label="资产分类">
              {selectedRows[0]?.spec}
            </Descriptions.Item>
            <Descriptions.Item label="原值">{selectedRows[0]?.price}</Descriptions.Item>
            <Descriptions.Item label="均价/单价(元)">
              {selectedRows[0]?.price}
            </Descriptions.Item>
            <Descriptions.Item label="价值类型">原值</Descriptions.Item>
            <Descriptions.Item label="资产编码">{selectedRows[0]?.no}</Descriptions.Item>
            <Descriptions.Item label="资产名称">
              {selectedRows[0]?.name}
            </Descriptions.Item>
            <Descriptions.Item label="数量">{selectedRows[0]?.amount}</Descriptions.Item>
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
          </Descriptions> */}
        </Modal>
        {openDonationform && (
          <DonationForm
            formdata={{
              id: getUuid(),
              no: '',
              sponsor: userCtrl.isCompanySpace
                ? userCtrl.company.name
                : userCtrl.user.name,
              needStore: '1',
              store: '',
              linkman: '',
              phone: '',
              totalValue: 0,
              amount: 0,
              reason: '',
              remark: '',
              welfareOrg: '',
              donorCode: '',
              status: Status.Draft,
              assets: [],
            }}
            backtolist={() => {
              setSelectedRows([]);
              setOpenDonationform(false);
            }}></DonationForm>
        )}
        {openSupportform && (
          <SupportForm
            formdata={{
              id: getUuid(),
              no: '',
              applicant: userCtrl.isCompanySpace
                ? userCtrl.company.name
                : userCtrl.user.name,
              needsomething: '',
              store: '',
              amount: 0,
              remark: '',
              status: Status.Draft,
              useWay: '',
              useAddress: '',
              expireTime: '2023-10-25',
              linkman: '',
              phone: '',
              reason: '',
              assets: selectedRows,
            }}
            backtolist={() => {
              setSelectedRows([]);
              setOpenSupportform(false);
            }}></SupportForm>
        )}
      </div>
    </div>
  );
};

export default WelfareMarket;
