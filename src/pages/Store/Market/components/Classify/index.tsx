import { AppstoreFilled, EllipsisOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Row, Col, message, Dropdown, Drawer, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import MarketClassifyTree from '@/components/CustomTreeComp';
import CreateMarketModal from '@/bizcomponents/GlobalComps/createMarket';
import DetailDrawer from './DetailDrawer';
import SearchShop from '@/bizcomponents/SearchShop';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import userCtrl from '@/ts/controller/setting';
import UserManagement from '../UserManagement';
import { IMarket } from '@/ts/core';
import { XMarket } from '@/ts/base/schema';

type modalType = 'create' | 'join' | 'detail' | 'edit' | 'users' | '';

interface Iprops {
  tkey: string;
  current: IMarket | undefined;
  setCurrent: (current: IMarket) => void;
}

const MarketClassify: React.FC<Iprops> = (props: Iprops) => {
  const [activeModal, setActiveModal] = useState<modalType>('');
  const [editMarket, setEditMarket] = useState<IMarket>(); // 被选中的树节点
  const [selectMarkets, setSelectedMarkets] = useState<XMarket[]>([]); // table数据
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
    if (editMarket) {
      await editMarket.update(
        formData.name,
        formData.code,
        formData.samrId,
        formData.remark,
        formData.joinPublic,
        formData.sellPublic,
        formData.buyPublic,
        formData.photo,
      );
    } else {
      const market = await marketCtrl.target.createMarket({ ...formData });
      if (market) {
        props.setCurrent(market);
      }
    }
    setActiveModal('');
  };

  const onCancel = () => {
    setActiveModal('');
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
                  onClick: () => {
                    setEditMarket(undefined);
                    setActiveModal('create');
                  },
                },
                {
                  label: '加入商店',
                  key: 'join',
                  onClick: () => {
                    setEditMarket(undefined);
                    setActiveModal('join');
                  },
                },
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
          content: '确定删除该商店吗',
          onOk: async () => {
            if (await marketCtrl.target.deleteMarket(node.market.id)) {
              message.success('删除成功');
              marketCtrl.changCallback();
            }
          },
        });
        break;
      case '编辑商店':
        setEditMarket(node);
        setActiveModal('edit');
        break;
      case '退出商店':
        Modal.confirm({
          title: '提示',
          content: '是否确认退出',
          onOk: async () => {
            if (await marketCtrl.target.quitMarket(node.market.id)) {
              message.success('退出成功');
              marketCtrl.changCallback();
            }
          },
        });
        break;
      case '基础详情':
        setEditMarket(node);
        setActiveModal('detail');
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
    const data = marketCtrl.target.joinedMarkets.map((itemModel) => {
      let arrs = ['基础详情', '用户管理'];
      if (itemModel.market.belongId === userCtrl.space.id) {
        arrs.push('编辑商店');
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
      <CreateMarketModal
        title="创建商店"
        open={activeModal === 'create'}
        handleOk={onOk}
        handleCancel={onCancel}
      />
      <CreateMarketModal
        title="编辑商店"
        open={activeModal === 'edit'}
        current={editMarket}
        handleOk={onOk}
        handleCancel={onCancel}
      />
      {editMarket && (
        <>
          <DetailDrawer
            title={editMarket.market.name}
            nodeDetail={editMarket.market}
            open={activeModal === 'detail'}
            onClose={onCancel}
          />
          <Drawer
            title="用户管理"
            destroyOnClose
            width={'75%'}
            open={activeModal === 'users'}
            onClose={onCancel}>
            <UserManagement current={editMarket} tkey={props.tkey} />
          </Drawer>
        </>
      )}
      <Modal
        title="加入商店"
        width={670}
        destroyOnClose={true}
        bodyStyle={{ padding: 0 }}
        open={activeModal === 'join'}
        onCancel={onCancel}
        onOk={async () => {
          for (const market of selectMarkets) {
            await userCtrl.user.applyJoinMarket(market.id);
          }
          setActiveModal('');
        }}>
        <SearchShop
          searchCallback={(markets: XMarket[]) => {
            setSelectedMarkets(markets);
          }}
        />
      </Modal>
    </div>
  );
};

export default MarketClassify;
