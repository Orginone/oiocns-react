import { Input, Button, Modal } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import MarketClassifyTree from '@/components/CustomTreeComp';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';

const x = 3;
const y = 2;
const z = 1;
const defaultData: DataNode[] = [];

const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || defaultData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: DataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

type CreateGroupPropsType = {
  createTitle: string;
  onClick?: () => void;
};

const Creategroup: React.FC<CreateGroupPropsType> = ({ createTitle }) => {
  // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // const [searchValue, setSearchValue] = useState('');
  // const [autoExpandParent, setAutoExpandParent] = useState(true);
  // const [hoverItemMes, setHoverItemMes] = useState<React.Key>();
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectMenu, setSelectMenu] = useState<string>('');
  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    if (userCtrl.Space && userCtrl.Space == undefined) {
      Modal.info({
        title: '提示',
        content: (
          <div>
            <p>请选择加入的部门空间！</p>
          </div>
        ),
        onOk() {
          location.href = '/home';
        },
      });
    }

    initData();
  }, []);

  const initData = async () => {};

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { value } = e.target;
    // const newExpandedKeys = treeData
    //   .map((item) => {
    //     if (item.title.indexOf(value) > -1) {
    //       return getParentKey(item.key, defaultData);
    //     }
    //     return null;
    //   })
    //   .filter((item, i, self) => item && self.indexOf(item) === i);
    // setExpandedKeys(newExpandedKeys as React.Key[]);
    // setSearchValue(value);
    // setAutoExpandParent(true);
    // 树过滤需要处理 TODO
  };

  const handleTitleClick = (node: any) => {
    // 触发内容去变化
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('选中树节点', selectedKeys, info.node);
    if (selectedKeys.length > 0) {
    }
  };

  /**
   * @desc: 创建新目录
   * @param {any} item
   * @return {*}
   */
  // const handleAddClick = (node: any) => {
  //   // console.log('handleAddClick', node);
  // };
  const handleMenuClick = (key: string, data: any) => {
    // console.log('点击', key, data);
    if (key === '新增部门') {
    }
  };
  const menu = ['新增部门'];

  return (
    <div>
      <Button className={cls.creatgroup} type="primary" onClick={() => {}}>
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
          handleMenuClick={handleMenuClick}
          treeData={treeData}
          title={'全部部门'}
          menu={menu}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default Creategroup;
