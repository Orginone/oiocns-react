import { Input, Tree, Space, TreeProps, Modal, Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState, useEffect } from 'react';
import {
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import settingController from '@/ts/controller/setting';
import cls from './index.module.less';

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

        <div className={cls.joingroup}>创建的岗位</div>

        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          switcherIcon={<DownOutlined />}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          onSelect={(e) => {
            if (e && e.length > 0) {
              settingController.trigger('createDept', { id: e[0] });
            }
          }}
          showIcon={true}
          titleRender={(e) => {
            return (
              <div
                className={cls.rightstyle}
                onMouseOver={() => {
                  setHoverItemMes(e.key);
                }}>
                {/* { e.icon? React.createElement(Icon[e.iconMes]):null} */}
                <span style={{ paddingRight: '8px' }}>{e?.title}</span>
                {hoverItemMes === e.key ? (
                  <Space>
                    <span
                      onClick={() => {
                        settingController.trigger('isOpenModal');
                      }}>
                      <PlusOutlined />
                    </span>
                    <span>
                      <MoreOutlined />
                    </span>
                  </Space>
                ) : null}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Creategroup;
