import { SearchOutlined } from '@ant-design/icons';
import { Input, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
const StoreClassifyTree: React.FC = () => {
  const [expKeys, setExpKeys] = useState(['']);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [keys, setKeys] = useState([docsCtrl.current?.key ?? '']);
  const refreshUI = () => {
    if (docsCtrl.current) {
      setKeys([docsCtrl.current.key]);
      let tkeys = docsCtrl.current.key.split('/');
      tkeys.forEach((_, index) => {
        const item = tkeys.slice(0, index + 1).join('/');
        if (!expKeys.includes(item)) {
          expKeys.push(item);
        }
      });
      setExpKeys([...expKeys]);
    }
    setTreeData([loadTreeData(docsCtrl.root)]);
  };
  const loadTreeData = (item: any) => {
    let result: any = {
      key: item.key,
      icon: expKeys.includes(item.key) ? (
        <img src="/icons/default_folder_opened.svg"></img>
      ) : (
        <img src="/icons/default_folder.svg"></img>
      ),
      title: item.name,
      children: [],
    };
    for (let i = 0; i < item.children.length; i++) {
      if (item.children[i].target.isDirectory) {
        result.children.push(loadTreeData(item.children[i]));
      }
    }
    return result;
  };
  useEffect(() => {
    const id = docsCtrl.subscribe(refreshUI);
    return () => {
      docsCtrl.unsubscribe(id);
    };
  }, []);
  const onSelect = (selectedKeys: any[]) => {
    if (selectedKeys.length > 0) {
      docsCtrl.open(selectedKeys[0]);
    }
  };
  return (
    <div>
      <div className={cls.title}>全部分类</div>
      <div className={cls.title}>
        <Input size="small" prefix={<SearchOutlined />} placeholder="搜索分类" />
      </div>
      <Tree
        className="draggable-tree"
        blockNode
        showIcon
        treeData={treeData}
        onSelect={onSelect}
        selectedKeys={keys}
        expandedKeys={expKeys}
        onExpand={(keys) => {
          setExpKeys(
            keys.map((item) => {
              return item.toString();
            }),
          );
        }}
      />
    </div>
  );
};

export default React.memo(StoreClassifyTree);
