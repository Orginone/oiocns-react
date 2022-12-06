import { Card, Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTablePage2';
import cls from './index.module.less';
import { Route, useHistory } from 'react-router-dom';
import { BtnGroupDiv } from '@/components/BtnGroupComp';
import PutawayComp from './Putaway';
import ShareComp from '../components/ShareComp';
import CreateApp from './CreatApp'; // 上架弹窗
import PublishList from './PublishList'; // 上架列表
import AppInfo from './Info'; //应用信息页面
import Manage from './Manage'; //应用管理页面
import StoreRecent from '../components/Recent';
import { MarketTypes } from 'typings/marketType';
import SelfAppCtrl, { SelfCallBackTypes } from '@/ts/controller/store/selfAppCtrl';
import IProduct from '@/ts/core/market/iproduct';
import TreeComp from '../Classify';
// import DeleteCustomModal from '@/components/DeleteCustomModal';
// import { productCtrl } from '@/ts/controller/store/productCtrl';

type ststusTypes = '全部' | '创建的' | '购买的' | '共享的' | '分配的';
const StoreApp: React.FC = () => {
  const history = useHistory();
  const [data, setData] = useState<IProduct[]>([]);
  const [recentlyAppIds, setRecentlyAppIds] = useState<string[]>([]);
  const [statusKey, setStatusKey] = useState<ststusTypes>('全部');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [checkNodes, setCheckNodes] = useState<any>({});
  const [shareType, setShareType] = useState<'分配' | '共享'>('共享');
  useEffect(() => {
    const id = SelfAppCtrl.subscribePart(SelfCallBackTypes.TableData, () => {
      setData([...SelfAppCtrl.tableData]);
    });
    const id2 = SelfAppCtrl.subscribePart(SelfCallBackTypes.Recently, () => {
      console.log('RecentlyRecently', SelfAppCtrl.recentlyUsedAppsIds);
      setRecentlyAppIds([...SelfAppCtrl.recentlyUsedAppsIds]);
    });
    // StoreSiderbar.changePageType('app');
    SelfAppCtrl.querySelfApps();
    return () => {
      return SelfAppCtrl.unsubscribe([id, id2]);
    };
  }, []);
  // 根据以获取数据 动态产生tab
  const items = useMemo(() => {
    let typeSet = new Set(['全部']);
    data?.forEach((v: any) => {
      typeSet.add(v.prod?.source);
    });
    return Array.from(typeSet).map((k) => {
      return { tab: k, key: k };
    });
  }, [data]);

  const BtnsList = ['购买', '创建'];
  const handleBtnsClick = (item: { text: string }) => {
    // console.log('按钮点击', item);
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

  const RentlyApps = useMemo(() => {
    let recentlyApps: IProduct[] = [];
    recentlyAppIds?.forEach((id: string) => {
      const prod = data.find((v) => {
        return v.prod.id === id;
      });
      prod && recentlyApps.push(prod);
    });

    return recentlyApps;
  }, [recentlyAppIds, data]);

  const onCheckeds = (teamId: string, type: string, checkedValus: any) => {
    console.log('输出选择', teamId, type, checkedValus);

    setCheckNodes({ teamId, type, checkedValus });
  };
  // 共享确认回调
  const submitShare = () => {
    SelfAppCtrl.ShareProduct(checkNodes.teamId, checkNodes.checkedValus, checkNodes.type);
    setShowShareModal(false);
  };
  const renderOperation = (item: IProduct): MarketTypes.OperationType[] => {
    return [
      {
        key: 'open',
        label: '打开',
        onClick: () => {
          SelfAppCtrl.curProduct = item;
          SelfAppCtrl.OpenApp(item);
          history.push({ pathname: '/online', state: { appId: item.prod?.id } });
        },
      },
      {
        key: 'detail',
        label: '详情',
        onClick: () => {
          SelfAppCtrl.curProduct = item;
          history.push({ pathname: '/store/app/info' });
        },
      },
      {
        key: 'manage',
        label: '管理',
        onClick: () => {
          SelfAppCtrl.curProduct = item;
          history.push({
            pathname: '/store/app/manage',
          });
        },
      },
      {
        key: 'putaway',
        label: '上架',
        onClick: () => {
          SelfAppCtrl.curProduct = item;
          history.push({
            pathname: '/store/app/putaway',
          });
        },
      },
      {
        key: 'share',
        label: '共享',
        onClick: () => {
          setShareType('共享');
          SelfAppCtrl.curProduct = item;
          setShowShareModal(true);
        },
      },
      {
        key: 'share2',
        label: '分配',
        onClick: () => {
          setShareType('分配');
          SelfAppCtrl.curProduct = item;
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
          SelfAppCtrl.curProduct = item;
          SelfAppCtrl.handleDeleteApp();
        },
      },
    ];
  };
  // 应用首页dom
  const AppIndex = useMemo(() => {
    return (
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        {RentlyApps.length > 0 && <StoreRecent dataSource={RentlyApps} />}
        <Card
          title="应用"
          className={cls['app-tabs']}
          extra={<BtnGroupDiv list={BtnsList} onClick={handleBtnsClick} />}
          tabList={items}
          onTabChange={(key) => {
            setStatusKey(key as ststusTypes);
          }}>
          <div className={cls['page-content-table']}>
            <AppShowComp
              list={data}
              searchParams={{ status: statusKey }}
              columns={SelfAppCtrl.getColumns('myApp')}
              renderOperation={renderOperation}
            />
          </div>
        </Card>
      </div>
    );
  }, [data, statusKey]);

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
          submitShare();
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setShowShareModal(false);
        }}>
        <ShareComp shareType={shareType} onCheckeds={onCheckeds} />
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
      <Route exact path="/store/app/publish" render={() => <PublishList />}></Route>
      <Route exact path="/store/app/manage" render={() => <Manage />}></Route>
      <Route exact path="/store/app/create" component={CreateApp}></Route>
      <Route exact path="/store/app/putaway" render={() => <PutawayComp />}></Route>
      <TreeComp />
    </>
  );
};

export default React.memo(StoreApp);
