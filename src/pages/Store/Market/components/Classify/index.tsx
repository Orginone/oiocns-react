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
import UserManagement from '../UserManagement';
import { IMarket } from '@/ts/core';
type modalType = 'create' | 'join' | 'detail' | 'users' | '';
interface Iprops {
  tkey: string;
  current: IMarket | undefined;
  setCurrent: (current: IMarket) => void;
}
const MarketClassify: React.FC<Iprops> = (props: Iprops) => {
  const [activeModal, setActiveModal] = useState<modalType>('');
  const [editMarket, setEditMarket] = useState<IMarket>(); // 被选中的树节点
  const [dataSource, setDataSource] = useState<any>([]); // table数据
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    getTreeData();
  }, [props.current, props.tkey]);

  /**
   * @description: 创建商店
   * @param {any} formData
   * @return {*}
   */
  const onOk = async (formData: any) => {
    const market = await marketCtrl.Market.createMarket({ ...formData });
    if (market) {
      props.setCurrent(market);
    }
    setActiveModal('');
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

  /**
   * @description: 目录更多操作 触发事件
   * @param {string} key
   * @param {IMarket} node
   * @return {*}
   */
  const handleMenuClick = (key: string, node: IMarket) => {
    switch (key) {
      case '删除商店':
        Modal.confirm({
          title: '提示',
          content: '是否确认删除',
          onOk: async () => {
            if (await marketCtrl.Market.deleteMarket(node.market.id)) {
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
            if (await marketCtrl.Market.quitMarket(node.market.id)) {
              message.success('退出成功');
            }
          },
        });
        break;
      case '基础详情':
        setActiveModal('detail');
        setEditMarket(node);
        break;
      case '用户管理':
        setActiveModal('users');
        setEditMarket(node);
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
    const data = marketCtrl.Market.joinedMarkets.map((itemModel) => {
      let arrs = ['基础详情', '用户管理'];
      if (itemModel.market.belongId === userCtrl.user.target.id) {
        arrs.push('删除商店');
      } else {
        arrs.push('退出商店');
      }
      return {
        title: itemModel.market.name,
        key: itemModel.market.id,
        item: itemModel,
        tag:
          itemModel.market.belongId === userCtrl.user.target.id
            ? {
                color: 'blue',
                txt: '我的',
              }
            : null,
        children: [],
        belongId: itemModel.market.belongId,
        menus: itemModel.market.belongId ? arrs : undefined,
      };
    });
    setTreeData(data);
  };

  return (
    <div className={cls.treeContainer}>
      <LeftOutlined className={cls.backicon} onClick={() => history.go(-1)} />
      <MarketClassifyTree
        parentIcon={<AppstoreFilled />}
        childIcon={<AppstoreFilled style={{ color: '#a6aec7' }} />}
        selectedKeys={[props.current?.market.id]}
        onSelect={(_: any, info: any) => props.setCurrent(info.node.item)}
        handleMenuClick={(key, node) => handleMenuClick(key, node.item)}
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
      {editMarket && (
        <>
          <DetailDrawer
            title={editMarket.market.name}
            nodeDetail={editMarket.market}
            open={activeModal === 'detail'}
            onClose={() => setActiveModal('')}
          />
          <Drawer
            title="用户管理"
            width={'75%'}
            open={activeModal === 'users'}
            onClose={() => setActiveModal('')}>
            <UserManagement current={editMarket} tkey={props.tkey} />
          </Drawer>
        </>
      )}
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
