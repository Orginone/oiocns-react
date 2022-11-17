import { Card, Form, Modal } from 'antd';
import React, { useState } from 'react';
import API from '@/services';
import AppShowComp from '@/bizcomponents/AppTablePage';
import MarketService from '@/module/appstore/market';
import cls from './index.module.less';
import { Route, useHistory } from 'react-router-dom';
import { BtnGroupDiv } from '@/components/CommonComp';
import PutawayComp from './Putaway';
import CreateApp from './CreatApp'; // 上架弹窗
import PublishList from './PublishList'; // 上架列表
import AppInfo from './Info'; //应用信息页面
import Manage from './Manage'; //应用管理页面
import StoreRecent from '../components/Recent';
import { MarketTypes } from 'typings/marketType';
const service = new MarketService({
  nameSpace: 'myApp',
  searchApi: API.product.searchOwnProduct,
  createApi: API.product.register,
  deleteApi: API.product.delete,
  updateApi: API.product.update,
});

const StoreApp: React.FC = () => {
  const history = useHistory();
  const [statusKey, setStatusKey] = useState('merchandise');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false); // 是否显示创建应用窗口

  const [selectAppInfo, setSelectAppInfo] = useState<MarketTypes.ProductType>(
    {} as MarketTypes.ProductType,
  );
  const [putawayForm] = Form.useForm();
  const [createAppForm] = Form.useForm<Record<string, any>>();
  const items = [
    {
      tab: `全部`,
      key: '1',
    },
    {
      tab: `创建的`,
      key: '2',
    },
    {
      tab: `购买的`,
      key: '3',
    },
    {
      tab: `共享的`,
      key: '4',
    },
    {
      tab: `分配的`,
      key: '5',
    },
  ];

  const BtnsList = ['购买', '创建', '暂存'];
  const handleBtnsClick = (item: { text: string }) => {
    // console.log('按钮点击', item);
    switch (item.text) {
      case '购买':
        history.push('/market/shop');
        break;
      case '创建':
        setShowCreateModal(true);
        break;
      case '暂存':
        console.log('点击事件', '暂存');
        break;
      default:
        console.log('点击事件未注册', item.text);
        break;
    }
  };

  const submitShare = () => {};
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'open',
        label: '打开',
        onClick: () => {
          history.push({ pathname: '/online', state: { appId: item.id } });
          console.log('按钮事件', 'open', item);
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          history.push({ pathname: '/store/app/info', state: { appId: item.id } });
          console.log('按钮事件', 'detail', item);
        },
      },
      {
        key: 'manage',
        label: '管理',
        onClick: () => {
          history.push({ pathname: '/store/app/manage', state: { appId: item.id } });
          console.log('按钮事件', 'manage', item);
        },
      },
      {
        key: 'putaway',
        label: '上架',
        onClick: () => {
          console.log('按钮事件', 'putaway', item);
          history.push({ pathname: '/store/app/putaway', state: { appId: item.id } });
        },
      },
      {
        key: 'share',
        label: '共享',
        onClick: () => {
          setShowShareModal(true);
        },
      },
      {
        key: 'share2',
        label: '分配',
        onClick: () => {
          console.log('按钮事件', 'share2', item);
        },
      },
      {
        key: 'save',
        label: '暂存',
        onClick: () => {
          // setShowPublishListModal(true);
          setSelectAppInfo({ ...item });
          history.push({ pathname: '/store/app/publish', state: { appId: item.id } });
          console.log('按钮事件', 'save', item);
        },
      },
    ];
  };
  return (
    <>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        {<StoreRecent />}
        <Card
          title="应用"
          className={cls['app-tabs']}
          extra={<BtnGroupDiv list={BtnsList} onClick={handleBtnsClick} />}
          tabList={items}
          onTabChange={(key) => {
            setStatusKey(key);
          }}
        />
        <div className={cls['page-content-table']}>
          <AppShowComp
            service={service}
            searchParams={{ status: statusKey }}
            columns={service.getMyappColumns()}
            renderOperation={renderOperation}
          />
        </div>
        {/* 创建应用 */}
        {showCreateModal && (
          <CreateApp
            form={createAppForm}
            layoutType="ModalForm"
            open={showCreateModal}
            title="创建应用"
            modalProps={{
              destroyOnClose: true,
              onCancel: () => setShowCreateModal(false),
            }}
          />
        )}
        {/* 详情页面 /store/app/info*/}
      </div>
      <Route
        exact
        path="/store/app/info"
        render={() => <AppInfo appId={selectAppInfo.id} />}></Route>
      <Route
        exact
        path="/store/app/publish"
        render={() => <PublishList appId={selectAppInfo.id} />}></Route>
      <Route
        exact
        path="/store/app/manage"
        render={() => <Manage appId={selectAppInfo.id} />}></Route>
      <Route
        exact
        path="/store/app/putaway"
        render={() => <PutawayComp appId={selectAppInfo.id} />}></Route>
    </>
  );
};

export default StoreApp;
