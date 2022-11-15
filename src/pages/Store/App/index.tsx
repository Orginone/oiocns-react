import { Card, Form, Modal } from 'antd';
import React, { useState } from 'react';
import API from '@/services';
import AppShowComp from '@/bizcomponents/AppTablePage';
import MarketService from '@/module/appstore/market';
import cls from './index.module.less';
import { Route, useHistory } from 'react-router-dom';
import { BtnGroupDiv } from '@/components/CommonComp';
import PutawayComp from '../components/PutawayComp'; // 上架弹窗
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
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectAppInfo, setSelectAppInfo] = useState<MarketTypes.ProductType>(
    {} as MarketTypes.ProductType,
  );
  const [putawayForm] = Form.useForm();

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
  const openShareModal = () => {};
  const handleBtnsClick = (item: { text: string }) => {
    // console.log('按钮点击', item);
    switch (item.text) {
      case '购买':
        history.push('/market/shop');
        break;
      case '创建':
        // console.log('点击事件', '创建1231313');
        break;
      case '暂存':
        console.log('点击事件', '暂存');
        setShowModal(true);
        break;
      default:
        console.log('点击事件未注册', item.text);
        break;
    }
  };
  const handlePutawaySumbit = async () => {
    const putawayParams = await putawayForm.validateFields();
    console.log('上架信息打印', putawayParams);

    setShowModal(false);
  };
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
        key: 'publish',
        label: '上架',
        onClick: () => {
          console.log('按钮事件', 'publish', item);
          setShowModal(true);
        },
      },
      {
        key: 'share',
        label: '共享',
        onClick: () => {
          openShareModal();
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
        <Modal
          title="应用上架"
          width={670}
          destroyOnClose={true}
          open={showModal}
          okText="确定"
          onOk={() => {
            handlePutawaySumbit();
          }}
          onCancel={() => {
            console.log(`取消按钮`);
            setShowModal(false);
          }}>
          <PutawayComp initialValues={{}} form={putawayForm} />
        </Modal>
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
    </>
  );
};

export default StoreApp;
