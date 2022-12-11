import { AppstoreFilled, EllipsisOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Row, Col, message, Dropdown, Drawer, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import NewStoreModal from '@/components/NewStoreModal';
import DetailDrawer from './DetailDrawer';
import JoinOtherShop from './JoinOtherShop';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import UserManagement from '../UserManagement';
import { IMarket } from '@/ts/core';
type modalType = 'create' | 'join' | 'detail' | 'users' | '';
const MarketClassify: React.FC<{ selectMarket: (item: IMarket) => void }> = ({
  selectMarket,
}) => {
  const [key, forceUpdate] = useCtrlUpdate(marketCtrl);
  const [activeModal, setActiveModal] = useState<modalType>('');
  const [treeDataObj, setTreeDataObj] = useState<any>({}); // 被选中的树节点
  const [dataSource, setDataSource] = useState<any>([]); // table数据
  const [selectMenu, setSelectMenu] = useState<string>('0-0');
  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    getTreeData();
    return () => {};
  }, [userCtrl.space]);

  /**
   * @description: 创建商店
   * @param {any} formData
   * @return {*}
   */
  const onOk = async (formData: any) => {
    if (await marketCtrl.Market.createMarket({ ...formData })) {
      message.success('创建成功');
    }
    setActiveModal('');
    forceUpdate();
  };

  /**
   * @description: 加入商店
   * @return {*}
   */
  const onJoinOk = async (val: any) => {
    setActiveModal('');
    setDataSource([]);
    if (await userCtrl.user.applyJoinMarket(val[0]?.id)) {
      message.success('申请已发送');
    }
  };

  /**
   * @description: 加入商店搜索回调
   * @param {any} val
   * @return {*}
   */
  const onChange = async (val: any) => {
    setDataSource((await marketCtrl.Market.getMarketByCode(val.target.value)).result);
  };

  /**
   * @description: 取消的回调
   * @return {*}
   */
  const onCancel = () => {
    setActiveModal('');
    setDataSource([]);
  };

  /**
   * @description: 树表头展示
   * @return {*}
   */
  const ClickBtn = (
    <Row justify="space-between" align="middle" className={cls.title}>
      <Col>商店分类</Col>
      <Col>
        <Button type="text" size="small">
          <Dropdown
            menu={{
              items: [
                {
                  label: '创建商店',
                  key: 'add',
                  onClick: () => setActiveModal('create'),
                },
                { label: '加入商店', key: 'join', onClick: () => setActiveModal('join') },
              ],
            }}>
            <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
          </Dropdown>
        </Button>
      </Col>
    </Row>
  );

  /*******
   * @desc: 点击目录 触发事件
   * @param {any} item
   * @return {*}
   */
  const handleTitleClick = (item: any) => {
    setSelectMenu(item.key);
    selectMarket(item?.node);
    marketCtrl.setCurrentMarket(item?.node);
    // 触发内容去变化
    marketCtrl.changeMenu(item);
  };

  /**
   * @description: 目录更多操作 触发事件
   * @param {string} key
   * @param {any} node
   * @return {*}
   */
  const handleMenuClick = (key: string, node: any) => {
    switch (key) {
      case '删除商店':
        Modal.confirm({
          title: '提示',
          content: '是否确认删除',
          onOk: async () => {
            if (await marketCtrl.Market.deleteMarket(node?.id)) {
              message.success('删除成功');
            }
          },
        });
        break;
      case '退出商店':
        Modal.confirm({
          title: '提示',
          content: '是否确认退出',
          onOk: async () => {
            if (await marketCtrl.Market.quitMarket(treeDataObj?.id)) {
              message.success('退出成功');
            }
          },
        });
        break;
      case '基础详情':
        setActiveModal('detail');
        setTreeDataObj(node);
        break;
      case '用户管理':
        setActiveModal('users');
        setTreeDataObj(node);
        marketCtrl.setCurrentMarket(node?.node);
        break;
      default:
        break;
    }
  };

  /**
   * @description: 获取市场列表
   * @return {*}
   */
  const getTreeData = () => {
    const data = userCtrl.space.joinedMarkets.map((itemModel, index) => {
      let arrs = ['基础详情', '用户管理'];
      if (itemModel.market.belongId === userCtrl.user.target.id) {
        arrs.push('删除商店');
      } else {
        arrs.push('退出商店');
      }
      if (index === 0) {
        selectMarket(itemModel);
      }
      console.log(itemModel);
      return {
        title: itemModel.market.name,
        key: `0-${index}`,
        id: itemModel.market.id,
        node: itemModel,
        tag:
          itemModel.market.belongId === userCtrl.user.target.id
            ? {
                color: 'blue',
                txt: '我的',
              }
            : null,
        children: [],
        belongId: itemModel.market.belongId,
        menus: arrs,
      };
    });
    setTreeData(data);
  };

  return (
    <div id={key} className={cls.treeContainer}>
      <LeftOutlined className={cls.backicon} onClick={() => history.go(-1)} />
      <MarketClassifyTree
        parentIcon={<AppstoreFilled />}
        childIcon={<AppstoreFilled style={{ color: '#a6aec7' }} />}
        selectedKeys={[selectMenu]}
        onSelect={(_: any, info: any) => handleTitleClick(info.node)}
        handleMenuClick={handleMenuClick}
        treeData={treeData}
        menu={'menus'}
        title={ClickBtn}
      />
      <NewStoreModal
        title="创建商店"
        open={activeModal === 'create'}
        onOk={onOk}
        onCancel={onCancel}
      />
      <DetailDrawer
        title={treeDataObj.title}
        nodeDetail={treeDataObj?.node?.market}
        open={activeModal === 'detail'}
        onClose={() => setActiveModal('')}
      />
      <Drawer
        title="用户管理"
        width={'75%'}
        open={activeModal === 'users'}
        onClose={() => setActiveModal('')}>
        <UserManagement />
      </Drawer>
      <JoinOtherShop
        title="搜索商店"
        open={activeModal === 'join'}
        onCancel={onCancel}
        onOk={onJoinOk}
        onChange={onChange}
        dataSource={dataSource || []}
      />
    </div>
  );
};

export default MarketClassify;
