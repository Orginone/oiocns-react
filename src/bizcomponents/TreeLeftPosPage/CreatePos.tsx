import { Input, Row, Button, Col, MenuProps, message } from 'antd';
import MarketClassifyTree from '@/components/CustomTreeComp';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect, useMemo } from 'react';
import { MoreOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import settingController from '@/ts/controller/setting';
import cls from './index.module.less';

/** 获取角色当前名称 */
interface PositionBean {
  key: string;
  id: string;
  name: string;
  code: string;
  create: string;
  createTime: string;
  remark: string;
}

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
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 树结构
  const [treeData, setTreeData] = useState<{}>([]);

  const [hoverItemMes, setHoverItemMes] = useState<React.Key>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    // 创建数据
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

  const items2: MenuProps['items'] = [
    {
      label: '更改岗位名称',
      key: '1',
    },
    {
      label: '删除',
      key: '2',
    },
  ];
  const [selectMenu, setSelectMenu] = useState<string>('');

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
  const [list, setList] = useState<any[]>([]);
  /**
   * @description: 处理商店树数据
   * @param {*} useMemo
   * @return {*}
   */
  const treelist = useMemo(() => {
    return items;
  }, [list]);
  const handleMenuClick = (item: any) => {
    // 触发内容去变化
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
      <Button type="link" onClick={() => {}}>
        创建商店
      </Button>
      <Button type="link" onClick={() => {}}>
        加入商店
      </Button>
    </>
  );

  const positionList = (
    <MarketClassifyTree
      key={selectMenu}
      handleMenuClick={handleMenuClick}
      treeData={items}
      menu={'menus'}
      clickBtn={ClickBtn}
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

export default Creategroup;
