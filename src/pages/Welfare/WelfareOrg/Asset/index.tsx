import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, message, Modal, RadioChangeEvent, Space } from 'antd';
import { common } from 'typings/common';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import cls from './index.module.less';
import { ProColumns } from '@ant-design/pro-components';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { AssetStoreColumns } from '@/pages/Welfare/config/columns';
import { Route, useHistory } from 'react-router-dom';
import PutawayComp from '@/pages/Store/content/App/Putaway';
import appCtrl from '@/ts/controller/store/appCtrl';
import PublishAssetForm from '@/pages/Welfare/WelfareOrg/PublishAssetForm';
import { getUuid } from '@/utils/tools';
import { Status } from '../../config/status';
import userCtrl from '@/ts/controller/setting';
import DoDonation from '@/pages/Welfare/WelfareOrg/DoDonation';
import AssetCard from '../WelfareMarket/AssetCard';
/**
 * 仓库/物资列表
 * @returns
 */
const Asset: React.FC<any> = () => {
  const parentRef = useRef<any>(null);
  const [datasource, setDatasource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [key, forceUpdate] = useObjectUpdate(datasource);
  const [openPublishPage, setOpenPublishPage] = useState<any>(null);
  const [openDodonation, setOpenDodonation] = useState<any>(null);
  const [openAssetCard, setOpenAssetCard] = useState<any>(null);
  const [openAssetModal, setOpenAssetModal] = useState<any>(null);
  const history = useHistory();
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

  const addAsset = () => {
    // message.warn('功能暂未开放');
    setOpenAssetModal(true);
  };

  const publish = (e: any) => {
    if (selectedRows.length > 0) {
      setOpenPublishPage(selectedRows[0]);
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  const dodonation = () => {
    if (selectedRows.length > 0) {
      setOpenDodonation(selectedRows[0]);
    } else {
      message.warn('至少选择一条未处理的数据');
    }
  };

  // 按钮
  const renderBtns = () => {
    return (
      <>
        <Button
          key="addAsset"
          style={{ marginRight: '10px' }}
          type="primary"
          onClick={addAsset}>
          添加资产
        </Button>
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
        key: 'opencard',
        label: '资产卡片',
        onClick: async () => {
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
        {!openPublishPage && !openDodonation && (
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
                    setSelectedRows(selectedRows);
                  },
                }}
              />
            </div>
          </PageCard>
        )}
        {openPublishPage && (
          <PublishAssetForm
            formdata={{
              id: getUuid(),
              no: '',
              sponsor: userCtrl.isCompanySpace
                ? userCtrl.company.name
                : userCtrl.user.name,
              market: '',
              store: '',
              needAssess: '1',
              netWorth: 0,
              totalValue: 0,
              amount: 0,
              reason: '',
              remark: '',
              status: Status.Draft,
              assets: selectedRows,
            }}
            backtolist={() => setOpenPublishPage(null)}></PublishAssetForm>
        )}
        {openDodonation && (
          <DoDonation
            formdata={{
              id: getUuid(),
              no: '',
              sponsor: userCtrl.isCompanySpace
                ? userCtrl.company.name
                : userCtrl.user.name,
              needStore: '1',
              store: '',
              needAssess: '1',
              linkman: '',
              phone: '',
              netWorth: 0,
              totalValue: 0,
              amount: 0,
              reason: '',
              remark: '',
              status: Status.Draft,
              welfareOrg: '',
              donorCode: '',
              donors: '',
              creator: '',
              creatorName: '',
              creatTime: '',
              assets: selectedRows,
            }}
            backtolist={() => setOpenDodonation(null)}></DoDonation>
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
        </Modal>
      </div>
    </div>
  );
};

export default Asset;
