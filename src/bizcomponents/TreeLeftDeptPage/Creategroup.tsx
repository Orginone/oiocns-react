import { Input, Tree ,Space,TreeProps, Button} from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useState,useEffect} from 'react';
import settingStore from '@/store/setting';
import { DownOutlined, ApartmentOutlined, PlusOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import settingController  from '@/ts/controller/setting/content';

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
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

type CreateGroupPropsType = {
  onSelect?: TreeProps['onSelect'];
  createTitle: string;
  onClick?:()=> void;
}

const Creategroup: React.FC<CreateGroupPropsType> = ({ 
  onSelect,
  createTitle,
}) => {
  useEffect(() => { 
    initData();
  }, [])
  

  

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData,setTreeData]=useState([])

  const [hoverItemMes, setHoverItemMes] = useState<React.Key>();
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { setEditItem } = settingStore((state) => ({ ...state}))


  const initData = async () => {
    const resultData = await settingController.getDepartments('381107910723375104');
    console.log('resultData',resultData);
  }

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map(item => {
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

  const treeData1: DataNode[] = [
    {
      title: '浙江省资产年报集团',
      key: '0',
      children: [
        {
          title: '集团子节点',
          key: '0-0',
          icon: <ApartmentOutlined />,
        },
        {
          title: '集团子节点',
          key: '0-1',
          icon: <ApartmentOutlined />,
        },
        {
          title: '集团子节点',
          key: '0-2',
          icon: <ApartmentOutlined />,
        },
      ],
    },
    {
      title: '浙江省资产年报集团',
      key: '1',
      children: [
        {
          title: '集团子节点',
          key: '1-1',
          icon: <ApartmentOutlined />,
        },
      ],
    },
  ];

  return (
    <div>
      <Button className={cls.creatgroup} type="primary" onClick={() => {setEditItem(true)}}>{createTitle}</Button>
      {Array.isArray(treeData1) && treeData1.length>0 ? <div className={cls.topMes}>
        <Input size="middle" className={cls.inputStyle} placeholder="搜索部门"
          prefix={<SearchOutlined />} onChange={ onChange } />
        <div className={cls.joingroup}>创建集团</div> 
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          switcherIcon={<DownOutlined />}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          onSelect={onSelect}
          showIcon={true}
          titleRender={(e) => { 
            return <div className={cls.rightstyle} onMouseOver={() => {
              setHoverItemMes(e.key);
            }}>
              <span style={{ paddingRight: '8px' }}>{e?.title}</span>
              {hoverItemMes === e.key ? <Space>
                <span onClick={() => {
                  setEditItem(true);
                }}><PlusOutlined /></span>
                <span><MoreOutlined /></span>
              </Space>: null }
            </div>
          }}
          />
      </div>:null}
    </div>
  );
};

export default Creategroup;