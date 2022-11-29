import {
  AppstoreFilled,
  DatabaseFilled,
  FileTextFilled,
  FundFilled,
} from '@ant-design/icons';
import { Menu, Button, Row, Col } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import StoreSiderbar from '@/ts/controller/store/sidebar';
import StoreContent from '@/ts/controller/store/content';
import NewStoreModal from '@/components/NewStoreModal';
import DeleteCustomModal from '@/components/DeleteCustomModal';
import DetailDrawer from './DetailDrawer';
import JoinOtherShop from '@/components/JoinOtherShop';
import { MarketController } from '@/ts/controller/store/marketCtrl';
import { settingCtrl } from '@/ts/controller/setting/settingCtrl';

const MarketClassify: React.FC<any> = ({ history }) => {
  const [list, setList] = useState<any[]>([]);
  const [deleOrQuit, setDeleOrQuit] = useState<'delete' | 'quit'>('delete');
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 创建商店
  const [isJoinShop, setIsJoinShop] = useState<boolean>(false); // 加入商店
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false); // 删除商店
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false); // 基础详情
  const [treeDataObj, setTreeDataObj] = useState<any>({}); // 被选中的树节点
  const [curSpace, setCurSpace] = useState<any>({});

  /**
   * @description: 实例化商店对象
   * @return {*}
   */
  const marketCtrl = new MarketController(curSpace);
  useEffect(() => {
    const id = settingCtrl.subscribe(() => {
      setCurSpace(settingCtrl?.getCurWorkSpace?.targtObj);
      if (settingCtrl.getCurWorkSpace) {
        setCurSpace(settingCtrl?.getCurWorkSpace?.targtObj);
      }
    });
    return () => {
      settingCtrl.unsubscribe(id);
    };
  }, []);

  /**
   * @description: 创建商店
   * @param {any} formData
   * @return {*}
   */
  const onOk = (formData: any) => {
    marketCtrl.creatMarkrt({ ...formData });
    setIsAddOpen(false);
    setIsJoinShop(false);
  };

  /**
   * @description: 删除 / 退出商店确认
   * @return {*}
   */
  const onDeleteOrQuitOk = () => {
    setIsDeleteOpen(false);
    {
      deleOrQuit === 'delete'
        ? marketCtrl.deleteMarket(treeDataObj?.id)
        : marketCtrl.quitMarket(treeDataObj?.id);
    }
  };

  /**
   * @description: 取消的回调
   * @return {*}
   */
  const onCancel = () => {
    setIsAddOpen(false);
    setIsDeleteOpen(false);
    setIsJoinShop(false);
  };

  const onClose = () => {
    setIsDetailOpen(false);
  };
  useEffect(() => {
    StoreSiderbar.curPageType = 'market';
    StoreSiderbar.subscribePart('marketTreeData', setList);
    StoreSiderbar.getTreeData();
    return () => {
      return StoreSiderbar.unsubscribePart('marketTreeData');
    };
  }, []);

  /**
   * @description: 处理商店树数据
   * @param {*} useMemo
   * @return {*}
   */
  const treelist = useMemo(() => {
    return list.filter((item) => item.title !== '开放市场');
  }, [list]);

  const [selectMenu, setSelectMenu] = useState<string>('');
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
    console.log('是是是', path);
    if (path === '/market/shop') {
      StoreContent.changeMenu('market');
    }

    setSelectMenu(path);
    history.push(path);
  };

  /**
   * @description: 树表头展示
   * @return {*}
   */
  const ClickBtn = (
    <>
      <Row>
        <Col>商店分类</Col>
      </Row>
      <Button
        type="link"
        onClick={() => {
          setIsAddOpen(true);
        }}>
        创建商店
      </Button>
      <Button
        type="link"
        onClick={() => {
          setIsJoinShop(true);
        }}>
        加入商店
      </Button>
    </>
  );

  /*******
   * @desc: 点击目录 触发事件
   * @param {any} item
   * @return {*}
   */
  const handleTitleClick = (item: any) => {
    // 触发内容去变化
    StoreContent.changeMenu(item);
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
    console.log('handleMenuClick55', key, node);
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
        history.push('/market/usermanagement');
        break;
      default:
        break;
    }
  };

  return (
    <div className={cls.container}>
      <div className={cls.subTitle}>常用分类</div>
      <Menu
        mode="inline"
        items={items}
        defaultOpenKeys={['openMarket']}
        onClick={({ key }) => handleChange(key)}
      />
      <MarketClassifyTree
        key={selectMenu}
        handleTitleClick={handleTitleClick}
        handleMenuClick={handleMenuClick}
        treeData={treelist}
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
        onClose={onClose}
      />
      <JoinOtherShop
        title="搜索商店"
        open={isJoinShop}
        onCancel={onCancel}
        onOk={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
};

export default MarketClassify;
