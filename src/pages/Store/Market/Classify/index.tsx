import {
  AppstoreFilled,
  DatabaseFilled,
  EllipsisOutlined,
  FileTextFilled,
  FundFilled,
} from '@ant-design/icons';
import { Button, Row, Col, message, Dropdown, Drawer, Menu } from 'antd';
import React, { useState } from 'react';
import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import NewStoreModal from '@/components/NewStoreModal';
import DeleteCustomModal from '@/components/DeleteCustomModal';
import DetailDrawer from './DetailDrawer';
import JoinOtherShop from './JoinOtherShop';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import userCtrl from '@/ts/controller/setting/userCtrl';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import UserManagement from '../UserManagement';

const MarketClassify: React.FC<any> = ({ history }) => {
  const [key, forceUpdate] = useCtrlUpdate(marketCtrl);
  const [deleOrQuit, setDeleOrQuit] = useState<'delete' | 'quit'>('delete');
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 创建商店
  const [isJoinShop, setIsJoinShop] = useState<boolean>(false); // 加入商店
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false); // 删除商店
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false); // 基础详情
  const [userOpen, setUserOpen] = useState<boolean>(false); // 基础详情
  const [treeDataObj, setTreeDataObj] = useState<any>({}); // 被选中的树节点
  const [dataSource, setDataSource] = useState<any>([]); // table数据
  const [selectMenu, setSelectMenu] = useState<string>('0-0');
  /**
   * @description: 创建商店
   * @param {any} formData
   * @return {*}
   */
  const onOk = async (formData: any) => {
    if (await marketCtrl.Market.createMarket({ ...formData })) {
      message.success('创建成功');
    }
    setIsAddOpen(false);
    forceUpdate();
  };

  /**
   * @description: 加入商店
   * @return {*}
   */
  const onJoinOk = async (val: any) => {
    setIsJoinShop(false);
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
   * @description: 删除 / 退出商店确认
   * @return {*}
   */
  const onDeleteOrQuitOk = async () => {
    setIsDeleteOpen(false);
    if (deleOrQuit === 'delete') {
      if (await marketCtrl.Market.deleteMarket(treeDataObj?.id)) {
        message.success('删除成功');
      }
    } else {
      if (await marketCtrl.Market.quitMarket(treeDataObj?.id)) {
        message.success('退出成功');
      }
    }
    forceUpdate();
  };

  /**
   * @description: 取消的回调
   * @return {*}
   */
  const onCancel = () => {
    setIsAddOpen(false);
    setIsDeleteOpen(false);
    setIsJoinShop(false);
    setDataSource([]);
  };

  const items = [
    {
      label: '开放市场',
      key: 'openMarket',
      icon: <AppstoreFilled />,
      children: [
        {
          label: '应用市场',
          key: '/market/shop',
          icon: <AppstoreFilled />,
        }, // 菜单项务必填写 key
        {
          label: '文档共享库',
          key: '/market/docx',
          icon: <FileTextFilled />,
        },
        { label: '数据市场', key: '/market/data', icon: <FundFilled /> },
        { label: '公益仓', key: '/market/publicProperty', icon: <DatabaseFilled /> },
      ],
    },
  ];

  const handleChange = (path: string) => {
    if (path === '/market/shop') {
      marketCtrl.changeMenu('market');
    }
    setSelectMenu(path);
    history.push(path);
  };

  /**
   * @description: 树表头展示
   * @return {*}
   */
  const ClickBtn = (
    <Row justify="space-between" align="middle">
      <Col>商店分类</Col>
      <Col>
        <Button type="text">
          <Dropdown
            menu={{
              items: [
                { label: '创建商店', key: 'add', onClick: () => setIsAddOpen(true) },
                { label: '加入商店', key: 'join', onClick: () => setIsJoinShop(true) },
              ],
            }}>
            <EllipsisOutlined />
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
    marketCtrl.setCurrentMarket(item?.node);
    // 触发内容去变化
    marketCtrl.changeMenu(item);
  };

  /**
   * @description: 删除商店弹窗
   * @param {any} item
   * @return {*}
   */
  const handleDeleteShop = (item?: any) => {
    setIsDeleteOpen(true);
    setDeleOrQuit('delete');
    setTreeDataObj(item);
  };

  /**
   * @description: 退出商店弹窗
   * @param {any} item
   * @return {*}
   */
  const handleQuitShop = (item?: any) => {
    setIsDeleteOpen(true);
    setDeleOrQuit('quit');
    setTreeDataObj(item);
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
        handleDeleteShop(node);
        break;
      case '退出商店':
        handleQuitShop(node);
        break;
      case '基础详情':
        setIsDetailOpen(true);
        setTreeDataObj(node);
        break;
      case '用户管理':
        setUserOpen(true);
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
    return marketCtrl.Market.joinedMarkets.map((itemModel, index) => {
      let arrs = ['基础详情', '用户管理'];
      if (itemModel.market.belongId === userCtrl.user.target.id) {
        arrs.push('删除商店');
      } else {
        arrs.push('退出商店');
      }
      return {
        title: itemModel.market.name,
        key: `0-${index}`,
        id: itemModel.market.id,
        node: itemModel,
        children: [],
        belongId: itemModel.market.belongId,
        menus: arrs,
      };
    });
  };

  return (
    <div id={key} className={cls.container}>
      {/* <div className={cls.subTitle}>常用分类</div>
      <Menu
        mode="inline"
        items={items}
        defaultOpenKeys={['openMarket']}
        onClick={({ key }) => handleChange(key)}
      /> */}
      <MarketClassifyTree
        parentIcon={<AppstoreFilled />}
        childIcon={<AppstoreFilled />}
        selectedKeys={[selectMenu]}
        onSelect={(_, info: any) => handleTitleClick(info.node)}
        handleMenuClick={handleMenuClick}
        treeData={getTreeData()}
        menu={'menus'}
        title={ClickBtn}
      />
      <NewStoreModal title="创建商店" open={isAddOpen} onOk={onOk} onCancel={onCancel} />
      <DeleteCustomModal
        title="提示"
        deleOrQuit={deleOrQuit}
        open={isDeleteOpen}
        onOk={onDeleteOrQuitOk}
        onCancel={onCancel}
        content={treeDataObj.title}
      />
      <DetailDrawer
        title={treeDataObj.title}
        nodeDetail={treeDataObj?.node?.market}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      <Drawer
        title="用户管理"
        width={'75%'}
        open={userOpen}
        onClose={() => setUserOpen(false)}>
        <UserManagement />
      </Drawer>
      <JoinOtherShop
        title="搜索商店"
        open={isJoinShop}
        onCancel={onCancel}
        onOk={onJoinOk}
        onChange={onChange}
        dataSource={dataSource || []}
      />
    </div>
  );
};

export default MarketClassify;
