import { Card, message, Modal } from 'antd';
import React, { useState } from 'react';
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
import TreeComp from './Classify';
import MoveApp from './moveApp';
import PublishComp from './PublishList';
import appCtrl from '@/ts/controller/store/appCtrl';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { myColumns } from '@/ts/controller/store/config';
import { XProduct } from '@/ts/base/schema';

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

  const renderOperation = (item: XProduct): common.OperationType[] => {
    const id = item.id;
    const shareArr = [
      {
        key: 'share',
        label: '共享',
        onClick: () => {
          appCtrl.setCurProduct(id);
          setShareType('共享');
          setShowShareModal(true);
        },
      },
    ];
    if (userCtrl.isCompanySpace) {
      shareArr.push({
        key: 'share2',
        label: '分配',
        onClick: () => {
          appCtrl.setCurProduct(id);
          setShareType('分配');
          setShowShareModal(true);
        },
      });
    }
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
        key: 'publish',
        label: '上架列表',
        onClick: () => {
          appCtrl.setCurProduct(id);
          history.push({ pathname: '/store/app/publish' });
        },
      },
      ...shareArr,
      {
        key: 'delete',
        label: <span style={{ color: 'red' }}>移除</span>,
        onClick: () => {
          Modal.confirm({
            content: `确认移除《 ${name} 》?`,
            async onOk() {
              await userCtrl.space.deleteProduct(id);
              appCtrl.changCallback();
            },
          });
        },
      },
    ];
  };
  // 根据权限从已获取数据 动态产生tab
  const getItems = () => {
    let typeSet = new Set(['全部']);
    appCtrl.products.forEach((v: any) => {
      v.source && typeSet.add(v.source);
    });

    return Array.from(typeSet).map((k) => {
      return { tab: k, key: k };
    });
  };
  // 应用首页dom
  const AppIndex = (
    <div key={key} className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
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
        onTabChange={(k) => {
          setStatusKey(k as ststusTypes);
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
  const handleSubmitShare = async () => {
    if (appCtrl.curProduct) {
      if (checkNodes?.createList?.length > 0) {
        const success = await appCtrl.curProduct?.createExtend(
          checkNodes.teamId,
          checkNodes.createList,
          checkNodes.type,
        );
        success && message.success('操作成功');
      }
      if (checkNodes?.delList?.length > 0) {
        const success = await appCtrl.curProduct?.deleteExtend(
          checkNodes.teamId,
          checkNodes.delList,
          checkNodes.type,
        );
        success && message.success('操作成功');
      }
      setShowShareModal(false);
    }
  };
  return (
    <>
      {location.hash === '#/store/app' && AppIndex}
      <Modal
        title={`应用${shareType}`}
        width={800}
        destroyOnClose={true}
        open={showShareModal}
        okText="确定"
        onOk={handleSubmitShare}
        onCancel={() => {
          setShowShareModal(false);
        }}>
        <ShareComp
          shareType={shareType}
          onCheckeds={(teamId, type, createList, delList) => {
            setCheckNodes({ teamId, type, createList, delList });
          }}
        />
      </Modal>
      {/* 详情页面 /store/app/info*/}
      <Route exact path="/store/app/info" render={() => <AppInfo />}></Route>
      <Route exact path="/store/app/manage" render={() => <Manage />}></Route>
      <Route exact path="/store/app/create" component={CreateApp}></Route>
      <Route exact path="/store/app/publish" component={PublishComp}></Route>
      <Route exact path="/store/app/putaway" render={() => <PutawayComp />}></Route>
      <TreeComp />
      <MoveApp appid={''} />
    </>
  );
};

export default React.memo(StoreApp);
