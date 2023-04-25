import { Button, Col, Dropdown, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import SearchSjopComp from '@/bizcomponents/SearchShop';
import cls from './index.module.less';
import StoreClassifyTree from '@/components/CustomTreeComp';
import { getUuid, findAimObj, getNewKeyWithString } from '@/utils/tools';

import ReactDOM from 'react-dom';
import { STORE_USER_MENU } from '@/constants/const';
import { EllipsisOutlined } from '@ant-design/icons';

let selectMenuInfo: any = {},
  modalType = '';
const { confirm } = Modal;
/* 菜单列表 */
const MenuOpts = ['新建分类', '重命名', '创建副本', '拷贝链接', '固定为常用', '删除'];
interface StoreClassifyType {
  onClassifySelect: (_appids: string[]) => void;
}
//自定义树
const StoreClassify: React.FC<StoreClassifyType> = ({ onClassifySelect }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [open, setOpen] = useState<boolean>(false);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false); // 新建商店弹窗
  const [customMenu, setCustomMenu] = useState<TreeType[]>([]);
  const [newMenuForm] = Form.useForm();
  useEffect(() => {
    const id = appCtrl.subscribePart(STORE_USER_MENU, () => {
      setCustomMenu([...appCtrl.spacies]);
    });
    return () => {
      return appCtrl.unsubscribe(id);
    };
  }, []);
  /**
   * @description: 树表头展示
   * @return {*}
   */
  const ClickBtn = (
    <Row justify="space-between" align="middle" className={cls.title}>
      <Col>仓库分类</Col>
      <Col>
        <Button type="text" size="small">
          <Dropdown
            menu={{
              items: [
                {
                  label: '新建分类',
                  key: 'add',
                  onClick: () => {
                    modalType = '新建分类';
                    selectMenuInfo = null;
                    newMenuForm.setFieldValue('title', '');
                    setIsStoreOpen(true);
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
  /*******
   * @desc:新建 自定义目录
   */
  const newMenuFormSubmit = async () => {
    let { title } = await newMenuForm.validateFields();
    let isCatch = true;
    let obj: any = selectMenuInfo && findAimObj(false, selectMenuInfo.id, customMenu);
    if (modalType === '新建分类') {
      let newObj = {
        id: getUuid(),
        key: '',
        title: title,
        items: [],
        icon: '',
        type: '',
        children: [],
      };
      if (!selectMenuInfo) {
        const haskeys = customMenu.map((v) => v.key);
        newObj.key = getNewKeyWithString(title, title, haskeys);
        setCustomMenu([...customMenu, newObj]);
        appCtrl.cacheCustomMenu([...customMenu, newObj]);
        isCatch = false;
      } else {
        const haskeys = obj.children.map((v: any) => v.key);
        newObj.key = getNewKeyWithString(title, title, haskeys);
        obj.children.push(newObj);
      }
    } else if (modalType === '重命名') {
      obj.title = title;
    }

    setIsStoreOpen(false);
    if (isCatch) {
      appCtrl.cacheCustomMenu(customMenu);
    }

    // 数据缓存
  };
  /*******
   * @desc: 删除一个自定义目录
   * @param {string} name
   * @param {string} id
   */
  const handleMenuChagnge = (name: string, id: string, type: string) => {
    confirm({
      content: `确认${type}目录《 ${name} 》?`,
      onOk() {
        _updataMenuData(id, type);
      },
      onCancel() {},
    });
  };
  function _updataMenuData(id: string, type: string) {
    switch (type) {
      case '删除':
        {
          const obj = findAimObj(true, id, customMenu);
          const newData = obj.children.filter((v: any) => {
            return v.id !== id;
          });
          obj.children = newData;
          // 处理 顶级目录删除
          if (!obj?.id) {
            appCtrl.cacheCustomMenu(newData);
            return;
          }
        }
        break;
      case '重命名':
        {
          const obj = findAimObj(false, id, customMenu);
          obj.title = '修改名称';
        }
        break;

      default:
        break;
    }
    appCtrl.cacheCustomMenu(customMenu);
  }

  /*******
   * @desc: 目录更多操作 触发事件
   * @param {'新建子级','重命名', '创建副本', '拷贝链接', '移动到', '固定到常用', '删除'} key
   * @param {object} param1
   * @return {*}
   */
  const handleMenuClick = (key: string, data: any) => {
    selectMenuInfo = data;
    modalType = key;
    switch (key) {
      case '新建分类':
        newMenuForm.setFieldValue('title', '');
        setIsStoreOpen(true);
        break;
      case '重命名':
        setIsStoreOpen(true);
        newMenuForm.setFieldValue('title', data.title);
        break;
      case '删除':
        handleMenuChagnge(data.title, data.id, '删除');
        break;
      case '创建副本':
        //TODO: 复制当前对象 遍历修改所有id
        // handleMenuChagnge(data.title, data.id, '创建副本');
        break;

      default:
        break;
    }
  };
  const domNode = document.getElementById('templateMenu');
  if (!domNode) return null;
  return ReactDOM.createPortal(
    <>
      {customMenu && (
        <>
          <div className={cls.container}>
            <StoreClassifyTree
              title={ClickBtn}
              menu={MenuOpts}
              searchable
              isDirectoryTree
              treeData={customMenu}
              handleTitleClick={(item: TreeType) => {
                onClassifySelect(item.items || []);
              }}
              handleMenuClick={handleMenuClick}
            />
          </div>
          <Modal
            title="搜索商店"
            width={670}
            destroyOnClose={true}
            open={showModal}
            bodyStyle={{ padding: 0 }}
            okText="确定加入"
            onOk={() => {
              setShowModal(false);
            }}
            onCancel={() => {
              setShowModal(false);
            }}>
            <SearchSjopComp />
          </Modal>
          <Modal
            title={modalType}
            width={670}
            destroyOnClose={true}
            open={isStoreOpen}
            okText="确定"
            onOk={() => {
              newMenuFormSubmit();
            }}
            onCancel={() => {
              setIsStoreOpen(false);
            }}>
            <Form form={newMenuForm} autoComplete="off">
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请填写目录名称' }]}>
                <Input placeholder="请填写目录名称" />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>,
    domNode,
  );
};

export default StoreClassify;
