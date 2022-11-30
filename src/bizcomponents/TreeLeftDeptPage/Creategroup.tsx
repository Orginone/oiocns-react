import { Input, Tree, Space, TreeProps, Modal, Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import {
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import settingController from '@/ts/controller/setting';
import cls from './index.module.less';

type CreateGroupPropsType = {
  createTitle: string;
  onClick?: () => void;
};

const Creategroup: React.FC<CreateGroupPropsType> = ({ createTitle }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 树结构
  const [treeData, setTreeData] = useState<{}>([]);

  const [hoverItemMes, setHoverItemMes] = useState<React.Key>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectMenu, setSelectMenu] = useState<string>('');

  useEffect(() => {
    initData();
    /** 监听页面是否需要更新 */
    settingController.addListen('updateDeptTree', () => {
      initData();
    });
  }, []);

  const initData = async () => {
    const resultData = await settingController.getDepartments('381107910723375104');
    console.log('====查询部门', resultData);
    setTreeData(resultData);
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const handleTitleClick = (node: any) => {
    // 触发内容去变化
  };

  const handleMenuClick = (_key: string, node: any) => {
    // 触发内容去变化
  };

  /**
   * @desc: 创建新目录
   * @param {any} item
   * @return {*}
   */
  const handleAddClick = (node: any) => {
    console.log('handleAddClick', node);
    settingController.trigger('isOpenModal');
  };

  return (
    <div>
      <Button
        className={cls.creatgroup}
        type="primary"
        onClick={() => {
          settingController.trigger('isOpenModal');
        }}>
        {createTitle}
      </Button>

      <div className={cls.topMes}>
        <Input
          size="middle"
          className={cls.inputStyle}
          placeholder="搜索部门"
          prefix={<SearchOutlined />}
          onChange={onChange}
        />
        <MarketClassifyTree
          // childIcon={<UserOutlined />}
          key={selectMenu}
          handleTitleClick={handleTitleClick}
          handleAddClick={handleAddClick}
          treeData={treeData}
          title={'全部部门'}
        />
      </div>
    </div>
  );
};

export default Creategroup;
