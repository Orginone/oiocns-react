import { Button } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import { IDepartment } from '@/ts/core/target/itarget';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { getUuid } from '@/utils/tools';
import MarketClassifyTree from '@/components/CustomTreeComp';

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
  currentKey: string;
  setCurrent: (current: schema.XTarget) => void;
  handleMenuClick: (key: string, item: any) => void; // 点击操作触发的事件
};

const Creategroup: React.FC<CreateGroupPropsType> = ({
  createTitle,
  handleMenuClick,
  setCurrent,
}) => {
  const [key, forceUpdate] = useCtrlUpdate(userCtrl);
  const [treeData, setTreeData] = useState<any[]>([]);

  const [createTreeData, setCreateTreeData] = useState<any[]>([]);

  useEffect(() => {
    initData(false);
  }, [key]);

  const initData = async (reload: boolean) => {
    const data = await userCtrl?.Company?.getJoinedGroups(reload);
    // 创建的集团， 加入的集团
    if (data?.length) {
      const tree = data.map((n: any) => {
        return createTeeDom(n);
      });
      const data2 = data.filter((n: any) => {
        if (n.target.createUser === userCtrl.User.target.id) {
          return createTeeDom(n);
        }
      });
      const tree2 = data2.map((n: any) => {
        return createTeeDom(n);
      });
      setTreeData(tree);
      setCreateTreeData(tree2);
    }
  };
  const createTeeDom = (n: IDepartment) => {
    const { target } = n;
    return {
      key: target.id + getUuid(),
      title: target.name,
      icon: target.avatar,
      // children: [],
      isLeaf: false,
      target: n,
    };
  };
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
          isLeaf: children.length == 0,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const loadDept = async ({ key, children, target }: any) => {
    if (children) {
      return;
    }
    const deptChild: any[] = await target.getSubGroups(false);
    console.log(deptChild);

    setTreeData((origin) =>
      updateTreeData(
        origin,
        key,
        deptChild.map((n) => createTeeDom(n)),
      ),
    );
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info: any) => {
    selectedKeys;
    if (info.selected) {
      setCurrent(info.node.target.target);
    }
  };

  const menu = ['新增集团'];

  return (
    <div>
      <div className={cls.topMes}>
        <Button
          className={cls.creatgroup}
          type="primary"
          onClick={() => handleMenuClick('new', {})}>
          {createTitle}
        </Button>
        <MarketClassifyTree
          id={key}
          showIcon
          searchable
          handleMenuClick={handleMenuClick}
          treeData={createTreeData}
          title={'创建集团'}
          menu={menu}
          loadData={loadDept}
          onSelect={onSelect}
        />
        <MarketClassifyTree
          id={key}
          showIcon
          searchable
          handleMenuClick={handleMenuClick}
          treeData={treeData}
          title={'加入集团'}
          menu={menu}
          loadData={loadDept}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default Creategroup;
