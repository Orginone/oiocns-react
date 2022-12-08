import { Card, Modal } from 'antd';
import React, { useMemo, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTablePage2';
import cls from './index.module.less';
import { Route, useHistory } from 'react-router-dom';
import { BtnGroupDiv } from '@/components/BtnGroupComp';
import PutawayComp from './Putaway';
import ShareComp from '../components/ShareComp';
import CreateApp from './CreatApp'; // 上架弹窗
import AppInfo from './Info'; //应用信息页面
import Manage from './Manage'; //应用管理页面
import StoreRecent from '../components/Recent';
import { common } from 'typings/common';
import TreeComp from '../Classify';
import MoveApp from './moveApp';
import appCtrl from '@/ts/controller/store/appCtrl';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { myColumns } from '@/ts/controller/store/config';
import { IProduct } from '@/ts/core';

type ststusTypes = '全部' | '创建的' | '购买的' | '共享的' | '分配的';
const StoreApp: React.FC = () => {
  const history = useHistory();
  const [key] = useCtrlUpdate(appCtrl);
  const [statusKey, setStatusKey] = useState<ststusTypes>('全部');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [checkNodes, setCheckNodes] = useState<any>({});
  const [shareType, setShareType] = useState<'分配' | '共享'>('共享');

  const BtnsList = ['购买', '创建'];
  const handleBtnsClick = (item: { text: string }) => {
    switch (item.text) {
      case '购买':
        history.push('/market/shop');
        break;
      case '创建':
        history.push('/store/app/create');
        break;
      default:
        console.log('点击事件未注册', item.text);
        break;
    }
  };

  const renderOperation = (item: IProduct): common.OperationType[] => {
    const id = item.prod.id;
    return [
      {
        key: 'open',
        label: '打开',
        onClick: () => {
          appCtrl.setCurProduct(id, true);
          history.push({ pathname: '/online', state: { appId: id } });
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          appCtrl.setCurProduct(id);
          history.push({ pathname: '/store/app/info' });
        },
      },
      // {
      //   key: 'manage',
      //   label: '管理',
      //   onClick: () => {
      //     SelfAppCtrl.curProduct = item;
      //     history.push({
      //       pathname: '/store/app/manage',
      //     });
      //   },
      // },
      {
        key: 'putaway',
        label: '上架',
        onClick: () => {
          appCtrl.setCurProduct(id);
          history.push({
            pathname: '/store/app/putaway',
          });
        },
      },
      {
        key: 'share',
        label: '共享',
        onClick: () => {
          appCtrl.setCurProduct(id);
          setShareType('共享');
          setShowShareModal(true);
        },
      },
      {
        key: 'share2',
        label: '分配',
        onClick: () => {
          appCtrl.setCurProduct(id);
          setShareType('分配');
          setShowShareModal(true);
        },
      },
      // {
      //   key: 'save',
      //   label: '暂存',
      //   onClick: () => {
      //     SelfAppCtrl.curProduct = item;
      //     history.push({
      //       pathname: '/store/app/publish',
      //     });
      //   },
      // },
      {
        key: 'delete',
        label: <span style={{ color: 'red' }}>移除</span>,
        onClick: () => {
          Modal.confirm({
            content: `确认移除《 ${name} 》?`,
            async onOk() {
              await userCtrl.Space.deleteProduct(id);
              appCtrl.changCallback();
            },
          });
        },
      },
    ];
  };
  // 根据以获取数据 动态产生tab
  const getItems = () => {
    let typeSet = new Set(['全部']);
    appCtrl.products.forEach((v: any) => {
      typeSet.add(v.source);
    });
    return Array.from(typeSet).map((k) => {
      return { tab: k, key: k };
    });
  };
  // 应用首页dom
  const AppIndex = useMemo(() => {
    return (
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        {appCtrl.alwaysUseApps.length > 0 ? (
          <StoreRecent dataSource={appCtrl.alwaysUseApps} />
        ) : (
          ''
        )}
        <Card
          title="我的应用"
          className={cls['app-tabs']}
          extra={<BtnGroupDiv list={BtnsList} onClick={handleBtnsClick} />}
          tabList={getItems()}
          activeTabKey={statusKey}
          onTabChange={(key) => {
            setStatusKey(key as ststusTypes);
          }}>
          <div className={cls['page-content-table']}>
            <AppShowComp
              list={appCtrl.products}
              searchParams={{ status: statusKey }}
              columns={myColumns}
              renderOperation={renderOperation}
            />
          </div>
        </Card>
      </div>
    );
  }, [key, statusKey]);

  return (
    <>
      {location.hash === '#/store/app' && AppIndex}
      <Modal
        title={`应用${shareType}`}
        width={800}
        destroyOnClose={true}
        open={showShareModal}
        okText="确定"
        onOk={() => {
          if (appCtrl.curProduct) {
            appCtrl.curProduct.createExtend(
              checkNodes.teamId,
              checkNodes.checkedValus,
              checkNodes.type,
            );
            setShowShareModal(false);
          }
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setShowShareModal(false);
        }}>
        <ShareComp
          shareType={shareType}
          onCheckeds={(teamId, type, checkedValues) => {
            setCheckNodes({ teamId, type, checkedValues });
          }}
        />
      </Modal>
      {/* <DeleteCustomModal
        title="警告"
        open={isDeleteOpen}
        deleOrQuit="delete"
        onOk={onOk}
        onCancel={onCancel}
        content={SelfAppCtrl.curProduct!.prod.name}
      /> */}
      {/* 详情页面 /store/app/info*/}
      <Route exact path="/store/app/info" render={() => <AppInfo />}></Route>
      <Route exact path="/store/app/manage" render={() => <Manage />}></Route>
      <Route exact path="/store/app/create" component={CreateApp}></Route>
      <Route exact path="/store/app/putaway" render={() => <PutawayComp />}></Route>
      <TreeComp />
      <MoveApp appid={''} />
    </>
  );
};

export default React.memo(StoreApp);
