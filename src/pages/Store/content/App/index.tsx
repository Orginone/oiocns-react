import { Card, message, Modal, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTablePage';
import cls from './index.module.less';
import { Route, useHistory } from 'react-router-dom';
import { GroupBtn } from '@/components/GroupBtn';
import PutawayComp from './Putaway';
import ShareComp from '../components/ShareComp';
import CreateApp from './CreatApp'; // 上架弹窗
import AppInfo from './Info'; //应用信息页面
import Manage from './Manage'; //应用管理页面
import StoreRecent from '../components/Recent';
import { common } from 'typings/common';
import MoveApp from './moveApp';
import PublishComp from './PublishList';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting';
import { IProduct, IResource } from '@/ts/core';
import appCtrl from '@/ts/controller/store/appCtrl';
import { ApplicationColumns } from '../../config/columns';

const StoreApp: React.FC = () => {
  const history = useHistory();
  const [key] = useCtrlUpdate(appCtrl);
  const [tabKey, setTabKey] = useState<string>('全部');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [moveModal, setMoveModal] = useState<boolean>(false);
  const [checkNodes, setCheckNodes] = useState<any>({});
  const [shareType, setShareType] = useState<'分配' | '共享'>('共享');
  const [appShowIdlimit, setAppShowIdlimit] = useState<string[]>([]);

  const renderOperation = (item: IProduct): common.OperationType[] => {
    const shareArr = [];
    if (item.prod.belongId == userCtrl.space.id) {
      shareArr.push({
        key: 'share',
        label: '共享',
        onClick: () => {
          appCtrl.setCurProduct(item);
          setShareType('共享');
          setShowShareModal(true);
        },
      });
      if (userCtrl.isCompanySpace) {
        shareArr.push({
          key: 'share2',
          label: '分配',
          onClick: () => {
            appCtrl.setCurProduct(item);
            setShareType('分配');
            setShowShareModal(true);
          },
        });
      }
    }
    return [
      {
        key: 'open',
        label: '打开',
        onClick: () => {
          appCtrl.setCurProduct(item, true);
          history.push({ pathname: '/online', state: { appId: item.id } });
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          appCtrl.setCurProduct(item);
          history.push({ pathname: '/store/app/info' });
        },
      },
      {
        key: 'putaway',
        label: '上架',
        onClick: () => {
          appCtrl.setCurProduct(item);
          history.push({
            pathname: '/store/app/putaway',
          });
        },
      },
      {
        key: 'publish',
        label: '上架列表',
        onClick: () => {
          appCtrl.setCurProduct(item);
          history.push({ pathname: '/store/app/publish' });
        },
      },
      {
        key: 'moveTo',
        label: '移动至',
        onClick: () => {
          appCtrl.setCurProduct(item);
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
              await userCtrl.space.deleteProduct(item.id);
              appCtrl.changCallback();
            },
          });
        },
      },
    ];
  };

  const handleSelectClassify = (appids: string[]) => {
    console.log('当前分类下的appids', appids);
    setAppShowIdlimit([...appids]);
  };
  const showData = useMemo(() => {
    if (appShowIdlimit.length > 0) {
      return appCtrl.products.filter((app) => {
        return appShowIdlimit.includes(app.prod.id);
      });
    } else {
      return appCtrl.products;
    }
  }, [appShowIdlimit, key]);

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
          title={<Typography.Title level={5}> 我的应用</Typography.Title>}
          className={cls['app-tabs']}
          extra={
            <GroupBtn
              list={[
                {
                  text: '购买',
                  onClick: () => {
                    history.push('/market/shop');
                  },
                },
                {
                  text: '创建',
                  onClick: () => {
                    history.push('/store/app/create');
                  },
                },
              ]}
            />
          }
          tabList={[
            { tab: '全部', key: '全部' },
            { tab: '共享的', key: '共享的' },
            { tab: '可用的', key: '可用的' },
            { tab: '创建的', key: '创建的' },
            { tab: '购买的', key: '购买的' },
          ]}
          activeTabKey={tabKey}
          onTabChange={(k) => {
            setTabKey(k);
          }}>
          <div className={cls['page-content-table']}>
            <AppShowComp
              list={showData}
              searchParams={{ status: tabKey }}
              columns={ApplicationColumns}
              renderOperation={renderOperation}
            />
          </div>
        </Card>
      </div>
    );
  }, [key, showData, tabKey]);
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
          message.success(`新增${checkNodes.resourceId ? '分配' : '分享'}, 操作成功`);
      }
      if (checkNodes?.delList?.length > 0) {
        const success = await target.deleteExtend(
          checkNodes.teamId,
          checkNodes.delList,
          checkNodes.type,
        );
        success &&
          message.success(`取消${checkNodes.resourceId ? '分配' : '分享'}, 操作成功`);
      }
      // 用户主动关闭 弹窗
      // setShowShareModal(false);
    } else {
      // setShowShareModal(false);
    }
  };
  return (
    <>
      {AppIndex}
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
      {/* <TreeComp onClassifySelect={handleSelectClassify} /> */}
      <MoveApp visible={moveModal} setVisible={setMoveModal} />
    </>
  );
};

export default React.memo(StoreApp);
