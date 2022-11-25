import { Form, Input, MenuProps, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import SearchSjopComp from '@/bizcomponents/SearchShop';
import cls from './index.module.less';
import StoreClassifyTree from '@/components/CustomTreeComp';
import CloudTreeComp from '@/components/CloudTreeComp';
import AppDetail from '@/components/AppDetail'; // 新建商店
import { getUuid } from '@/utils/tools';

import { useLocation } from 'react-router-dom';
// import useStore from '@/store';
import StoreSiderbar from '@/ts/controller/store/sidebar';
import StoreContent from '@/ts/controller/store/content';
import { XProduct } from '@/ts/base/schema';
// const items = [
//   { label: '应用', key: 'app', icon: 'AppstoreOutlined' }, // 菜单项务必填写 key
//   { label: '文档', key: 'doc', icon: 'FileTextOutlined' },
//   { label: '数据', key: 'data', icon: 'FundOutlined' },
//   { label: '资源', key: 'src', icon: 'DatabaseOutlined'},
// ];
let selectMenuObj = { key: '', id: '', children: [] },
  selectMenuInfo: any = {};

const menu = ['重命名', '创建副本', '拷贝链接', '移动到', '收藏', '删除'];
//自定义树
const StoreClassify: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [open, setOpen] = useState<boolean>(false);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false); // 新建商店弹窗
  const [isAppDetailOpen, setisAppDetailOpen] = useState<boolean>(false); // 新建商店弹窗
  const [list, setList] = useState<XProduct[]>([]);
  const location = useLocation();
  const router = `${location.pathname}${location.search}`;
  const [newMenuForm] = Form.useForm();

  useEffect(() => {
    console.log('初始化', 'APP頁面');
    StoreSiderbar.subscribePart('appTreeData', setList);
    StoreSiderbar.changePageType('app');
    StoreSiderbar.getTreeData();
    return () => {
      return StoreSiderbar.unsubscribePart('appTreeData');
    };
  }, []);

  const newMenuFormSubmit = async () => {
    let { title } = await newMenuForm.validateFields();
    console.log('是是是', title, selectMenuInfo);

    let newObj = {
      id: getUuid(),
      key: `${selectMenuInfo?.key}-${selectMenuInfo?.children?.length || '01'}`,
      title: title,
    };
    selectMenuInfo.children.push(newObj);
    setIsStoreOpen(false);
    // setList([...list]);
    console.log('form数据', list);
    // 数据缓存
    StoreSiderbar.updataSelfAppMenu(list);
  };
  const onCancel = () => {
    setIsStoreOpen(false);
    setisAppDetailOpen(false);
  };

  /**
   * @desc: 创建新目录
   * @param {any} item
   * @return {*}
   */
  const handleAddShop = (item: any) => {
    console.log('handleAddShop', item);
    selectMenuInfo = { ...selectMenuObj, ...item };
    setIsStoreOpen(true);
  };
  /*******
   * @desc: 目录更多操作 触发事件
   * @param {object} param1
   * @return {*}
   */
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    console.log('目录更多操作', key);
  };
  /*******
   * @desc: 点击目录 触发事件
   * @param {any} item
   * @return {*}
   */
  const handleTitleClick = (item: any) => {
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
      <Modal
        title="新建目录"
        width={670}
        destroyOnClose={true}
        open={isStoreOpen}
        bodyStyle={{ padding: 0 }}
        okText="确定"
        onOk={() => {
          console.log(`确定按钮`);
          newMenuFormSubmit();
        }}
        onCancel={() => {
          console.log(`取消按钮`);
          setIsStoreOpen(false);
        }}>
        <Form form={newMenuForm} autoComplete="off">
          <Form.Item
            label="目录名称"
            name="title"
            rules={[{ required: true, message: '请填写目录名称' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <AppDetail open={isAppDetailOpen} onCancel={onCancel} />
      {/* <button onClick={(e)=>{
        console.log(e);
        setisAppDetailOpen(true)
      }}>123</button> */}
    </>
  );
};

export default StoreClassify;
