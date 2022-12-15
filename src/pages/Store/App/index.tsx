import { Card, message, Modal } from 'antd';
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
import TreeComp from './Classify';
import MoveApp from './moveApp';
import PublishComp from './PublishList';
import appCtrl from '@/ts/controller/store/appCtrl';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { myColumns } from './Config';
import { IProduct, IResource } from '@/ts/core';

type ststusTypes = '全部' | '创建的' | '购买的' | '共享的' | '分配的';
const StoreApp: React.FC = () => {
  const history = useHistory();
  const [key] = useCtrlUpdate(appCtrl);
  const [statusKey, setStatusKey] = useState<ststusTypes>('全部');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [moveModal, setMoveModal] = useState<boolean>(false);
  const [checkNodes, setCheckNodes] = useState<any>({});
  const [shareType, setShareType] = useState<'分配' | '共享'>('共享');
  const [appShowIdlimit, setAppShowIdlimit] = useState<string[]>([]);

  const BtnsList = ['购买', '创建'];
  const handleBtnsClick = (item: { text: string }) => {
    switch (item.text) {
      case '购买':
        history.push('/market/shop');
        break;
      case '创建':
        appCtrl.setCurProduct();
        history.push('/store/app/create');
        break;
      default:
        console.log('点击事件未注册', item.text);
        break;
    }
  };

  const renderOperation = (item: IProduct): common.OperationType[] => {
    const id = item.prod.id;
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
      {
        key: 'moveTo',
        label: '移动至',
        onClick: () => {
          appCtrl.setCurProduct(id);
          setMoveModal(true);
        },
      },
      ...shareArr,
      {
        key: 'delete',
        label: <span style={{ color: 'red' }}>移除</span>,
        onClick: () => {
          Modal.confirm({
            content: `确认移除《 ${item.prod.name} 》?`,
            async onOk() {
              await userCtrl.space.deleteProduct(id);
              appCtrl.changCallback();
            },
          });
        },
      },
    ];
  };
  //TODO: 根据权限从已获取数据 动态产生tab
  const getItems = () => {
    let typeSet = new Set(['全部']);
    appCtrl.products.forEach((v: any) => {
      v.source && typeSet.add(v.source);
    });

    return Array.from(typeSet)
      .filter(Boolean)
      .map((k) => {
        return { tab: k, key: k };
      });
  };
  /*******
   * @desc: 获取所选分类下的appids
   * @param {string[]} appids
   */
  const handleSelectClassify = (appids: string[]) => {
    console.log('当前分类下的appids', appids);
    setAppShowIdlimit([...appids]);
  };
  let showData = appCtrl.products;
  showData = useMemo(() => {
    if (appShowIdlimit.length > 0) {
      return appCtrl.products.filter((app) => {
        return appShowIdlimit.includes(app.prod.id);
      });
    } else {
      return appCtrl.products;
    }
  }, [appShowIdlimit, key, userCtrl.space]);

  // 应用首页dom
  const AppIndex = useMemo(() => {
    return (
      <div
        key={key}
        className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
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
              list={showData}
              searchParams={{ status: statusKey }}
              columns={myColumns}
              renderOperation={renderOperation}
            />
          </div>
        </Card>
      </div>
    );
  }, [key, showData]);
  const getCurResource = () => {
    return appCtrl.curProduct?.resource?.find(
      (R: IResource) => R.resource.id === checkNodes.resourceId,
    );
  };
  // 提交分享
  const handleSubmitShare = async () => {
    if (appCtrl.curProduct) {
      const target = checkNodes.resourceId ? getCurResource() : appCtrl.curProduct;
      if (!target) {
        setShowShareModal(false);
        return;
      }
      if (checkNodes?.createList?.length > 0) {
        const success = await target.createExtend(
          checkNodes.teamId,
          checkNodes.createList,
          checkNodes.type,
        );
        success &&
          message.success(`新增${checkNodes.resourceId ? '分配' : '分享'},操作成功`);
      }
      if (checkNodes?.delList?.length > 0) {
        const success = await target.deleteExtend(
          checkNodes.teamId,
          checkNodes.delList,
          checkNodes.type,
        );
        success &&
          message.success(`取消${checkNodes.resourceId ? '分配' : '分享'},操作成功`);
      }
      // 用户主动关闭 弹窗
      // setShowShareModal(false);
    } else {
      // setShowShareModal(false);
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
          onCheckeds={(teamId, type, createList, delList, resourceId) => {
            setCheckNodes({ teamId, type, createList, delList, resourceId });
          }}
        />
      </Modal>
      {/* 详情页面 /store/app/info*/}
      <Route exact path="/store/app/info" render={() => <AppInfo />}></Route>
      <Route exact path="/store/app/manage" render={() => <Manage />}></Route>
      <Route exact path="/store/app/create" component={CreateApp}></Route>
      <Route exact path="/store/app/publish" component={PublishComp}></Route>
      <Route exact path="/store/app/putaway" render={() => <PutawayComp />}></Route>
      <TreeComp onClassifySelect={handleSelectClassify} />
      <MoveApp visible={moveModal} setVisible={setMoveModal} />
    </>
  );
};

export default React.memo(StoreApp);
