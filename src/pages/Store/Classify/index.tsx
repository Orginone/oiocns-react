import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import SearchSjopComp from '@/bizcomponents/SearchShop';
import cls from './index.module.less';
import StoreClassifyTree from '@/components/CustomTreeComp';
import CloudTreeComp from '@/components/CloudTreeComp';
import NewStoreModal from '@/components/NewStoreModal'; // 新建商店

import { useLocation } from 'react-router-dom';
// import useStore from '@/store';
import StoreSiderbar from '@/ts/controller/store/sidebar';
import StoreContent from '@/ts/controller/store/content';
// const items = [
//   { label: '应用', key: 'app', icon: <AppstoreOutlined /> }, // 菜单项务必填写 key
//   { label: '文档', key: 'doc', icon: <FileTextOutlined /> },
//   { label: '数据', key: 'data', icon: <FundOutlined /> },
//   { label: '资源', key: 'src', icon: <DatabaseOutlined /> },
// ];

const menu = ['重命名', '创建副本', '拷贝链接', '移动到', '收藏', '删除'];
//自定义树
const StoreClassify: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [open, setOpen] = useState<boolean>(false);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false); // 新建商店弹窗
  const [list, setList] = useState<any[]>([]);
  const location = useLocation();
  const router = `${location.pathname}${location.search}`;
  // const { user } = useStore((state) => ({ ...state })); // 用户信息

  // const [total, setTotal] = useState<number>(0);
  // const history = useHistory();
  useEffect(() => {
    console.log('初始化', 'APP頁面');

    StoreSiderbar.currentMenu = 'myApps';
    StoreSiderbar.TreeCallBack = setList;
    StoreSiderbar.getTreeData();
  }, []);

  const onOk = async (data: any) => {
    setIsStoreOpen(false);
    console.log('form数据', data);
    // await Service.creatItem({
    //   ...data,
    //   samrId: user.team.targetId,
    //   authId: user.workspaceId,
    // });
  };
  const onCancel = () => {
    setIsStoreOpen(false);
  };

  /**
   * @desc: 创建新目录
   * @param {any} item
   * @return {*}
   */
  const handleAddShop = (item: any) => {
    debugger;
    console.log('handleAddShop', item);
    setIsStoreOpen(true);
  };
  /*******
   * @desc: 目录更多操作 触发事件
   * @param {object} param1
   * @return {*}
   */
  const handleMenuClick = ({ data, key }: { data: any; key: string }) => {
    debugger;
    console.log('handleMenuClick55', data, key);
  };
  /*******
   * @desc: 点击目录 触发事件
   * @param {any} item
   * @return {*}
   */
  const handleTitleClick = (item: any) => {
    debugger;
    // 触发内容去变化
    StoreContent.changeMenu(item);
  };
  return (
    <>
      <div className={cls.container}>
        {router == '/store/doc' ? (
          //文档树
          <CloudTreeComp></CloudTreeComp>
        ) : (
          //其他树
          <StoreClassifyTree
            menu={menu}
            searchable
            draggable
            treeData={list}
            handleTitleClick={handleTitleClick}
            handleAddClick={handleAddShop}
            handleMenuClick={handleMenuClick}
          />
        )}
      </div>
      <Modal
        title="搜索商店"
        width={670}
        destroyOnClose={true}
        open={showModal}
        bodyStyle={{ padding: 0 }}
        okText="确定加入"
        onOk={() => {
          console.log(`确定按钮`);
          setShowModal(false);
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setShowModal(false);
        }}>
        <SearchSjopComp />
      </Modal>
      {/* 新建商店 */}
      <NewStoreModal
        title={'新建商店'}
        open={isStoreOpen}
        onOk={onOk}
        onCancel={onCancel}
      />
    </>
  );
};

export default StoreClassify;
