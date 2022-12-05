import React from 'react';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import StoreClassifyTree from '@/components/CustomTreeComp';
import { getIcon, getItemMenu } from '../CommonMenu';
import cls from './index.module.less';

const DocClassifyTree = ({
  currentKey,
  handleMenuClick,
}: {
  currentKey: string;
  handleMenuClick: (key: string, node: any) => void;
}) => {
  const loadExpKeys = () => {
    let tkeys = currentKey.split('/');
    return tkeys.map((_, index) => {
      return tkeys.slice(0, index + 1).join('/');
    });
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
  const onSelect = (selectedKeys: string[]) => {
    if (selectedKeys.length > 0) {
      docsCtrl.open(selectedKeys[0]);
    }
  };
  const onExpand = async (_: any, info: { expanded: boolean; node: { key: string } }) => {
    if (info.expanded) {
      await docsCtrl.open(info.node.key);
    }
  };
  return (
    <StoreClassifyTree
      className={cls.docTree}
      title={'文档目录'}
      isDirectoryTree
      menu={'menus'}
      searchable
      showIcon
      treeData={[loadTreeData(docsCtrl.root)]}
      defaultExpandedKeys={loadExpKeys()}
      selectedKeys={[currentKey]}
      onSelect={onSelect}
      onExpand={onExpand}
      handleMenuClick={handleMenuClick}
      icon={getIcon}
    />
  );
};

export default DocClassifyTree;
