// import { SearchOutlined } from '@ant-design/icons';
// import { Input, Tree } from 'antd';
import { ImFolderOpen, ImFolder } from 'react-icons/im';
import React, { useEffect, useState } from 'react';

import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import StoreClassifyTree from '@/components/CustomTreeComp';
const DocClassifyTree: React.FC = () => {
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
    const treedata = [loadTreeData(docsCtrl.root)];
    setTreeData(treedata);
  };
  const loadTreeData = (item: any) => {
    let result: any = {
      key: item.key,
      icon: expKeys.includes(item.key) ? (
        <ImFolderOpen color="#c09553" />
      ) : (
        <ImFolder color="#c09553" />
      ),
      title: item.name,
      children: [],
      isLeaf: !item.target.hasSubDirectories,
    };
    if (item.children.length > 0) {
      for (let i = 0; i < item.children.length; i++) {
        if (item.children[i].target.isDirectory) {
          result.children.push(loadTreeData(item.children[i]));
        }
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
  const onSelect = (selectedKeys: string[]) => {
    console.log(selectedKeys);
    if (selectedKeys.length > 0) {
      docsCtrl.open(selectedKeys[0]);
    }
  };
  const loadChild = async (node: any) => {
    if (node.children.length === 0) await docsCtrl.open(node.key);
  };

  return (
    <StoreClassifyTree
      // menu={menu}
      searchable
      showIcon
      treeData={treeData}
      // loadData={loadChild}
      expandedKeys={expKeys}
      selectedKeys={keys}
      onSelect={onSelect}
      onExpand={(
        expandedKeys: string[],
        { expanded: bool, node }: { expanded: boolean; node: any },
      ) => {
        if (expandedKeys.length > 0 && bool) {
          loadChild(node);
        }
        setExpKeys(
          expandedKeys.map((item) => {
            return item.toString();
          }),
        );
      }}
      // handleTitleClick={handleTitleClick}
      // handleAddClick={handleAddShop}
      // handleMenuClick={handleMenuClick}
    />
    // <div>
    //   <div className={cls.title}>全部分类</div>
    //   <div className={cls.title}>
    //     <Input size="small" prefix={<SearchOutlined />} placeholder="搜索分类" />
    //   </div>
    //   <Tree
    //     className="draggable-tree"
    //     blockNode
    //     showIcon
    //     treeData={treeData}
    //     onSelect={onSelect}
    //     selectedKeys={keys}
    //     expandedKeys={expKeys}
    //     onExpand={(keys) => {
    //       setExpKeys(
    //         keys.map((item) => {
    //           return item.toString();
    //         }),
    //       );
    //     }}></Tree>
    // </div>
  );
};

export default React.memo(DocClassifyTree);
