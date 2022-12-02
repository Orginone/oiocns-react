import { Input, Button } from 'antd';
import MarketClassifyTree from '@/components/CustomTreeComp';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import settingController from '@/ts/controller/setting';
import cls from './index.module.less';

type CreateGroupPropsType = {
  createTitle: string;
  onClick?: () => void;
};

const items: DataNode[] = [
  {
    title: '管理员',
    key: 'super-manager',
    icon: <UserOutlined />,
    children: [],
  },
  {
    title: '管理员2',
    key: 'super-manager2',
    icon: <UserOutlined />,
    children: [],
  },
];

const CreatePosition: React.FC<CreateGroupPropsType> = ({ createTitle }) => {
  // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // const [searchValue, setSearchValue] = useState('');
  // const [autoExpandParent, setAutoExpandParent] = useState(true);
  // const [treeData, setTreeData] = useState<{}>([]);
  // const [hoverItemMes, setHoverItemMes] = useState<React.Key>();
  // const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    // 查询后台的数据
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const [selectMenu, setSelectMenu] = useState<string>('');

  const handleMenuClick = (key: string, data: any) => {
    // 触发内容去变化
    console.log('点击', key, data);
  };

  const handleTitleClick = (item: any) => {
    // 触发内容去变化
    console.log('点击', item);
    // StoreContent.changeMenu(item);
  };

  const menu = ['更改岗位名称', '删除'];
  const positionList = (
    <MarketClassifyTree
      childIcon={<UserOutlined />}
      key={selectMenu}
      handleMenuClick={handleMenuClick}
      handleTitleClick={handleTitleClick}
      treeData={items}
      menu={menu}
      title={'全部岗位'}
    />
  );

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
          placeholder="搜索岗位"
          prefix={<SearchOutlined />}
          onChange={onChange}
        />

        {/* <div className={cls.joingroup}>创建的岗位</div> */}
        {positionList}
      </div>
    </div>
  );
};

export default CreatePosition;
