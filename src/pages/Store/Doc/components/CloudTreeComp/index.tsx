import React, { useEffect, useState } from 'react';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import StoreClassifyTree from '@/components/CustomTreeComp';
// import ResetNameModal from '../ResetName';
// import CoppyOrMove from '../CoppyOrMove';
import { getIcon, getItemMenu } from '../CommonMenu';
import cls from './index.module.less';
import ReactDOM from 'react-dom';

const DocClassifyTree = ({
  handleMenuClick,
}: {
  handleMenuClick: (key: string, node: any) => void;
}) => {
  const [treeData, setTreeData] = useState<any[]>();
  const [keys, setKeys] = useState([docsCtrl.current?.key ?? '']);
  const [expKeys, setExpKeys] = useState([docsCtrl.current?.key ?? '']);

  const domNode = document.getElementById('templateMenu');
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
      menus: getItemMenu(item, true),
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
    if (selectedKeys.length > 0) {
      docsCtrl.open(selectedKeys[0]);
    }
  };
  const onExpand = async (
    expandedKeys: string[],
    { expanded, node }: { expanded: boolean; node: any },
  ) => {
    setExpKeys(expandedKeys);
    if (expanded) {
      await docsCtrl.open(node.key);
    }
  };

  if (!domNode) return null;
  return ReactDOM.createPortal(
    <>
      {treeData && (
        <StoreClassifyTree
          className={cls.docTree}
          title={'文档目录'}
          fieldNames={{ title: 'name' }}
          isDirectoryTree
          menu={'menus'}
          searchable
          showIcon
          treeData={treeData}
          expandedKeys={expKeys}
          selectedKeys={keys}
          onSelect={onSelect}
          onExpand={onExpand}
          handleMenuClick={handleMenuClick}
          icon={getIcon}
        />
      )}
    </>,
    domNode,
  );
};

export default React.memo(DocClassifyTree);
