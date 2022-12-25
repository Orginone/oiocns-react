import React, { useMemo } from 'react';
import { useState } from 'react';
import { Modal, Tree } from 'antd';
import storeCtrl from '@/ts/controller/store';
import { IMFolder, IMFolderOpen } from '@icongo/im';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { IFileSystemItem, IObjectItem } from '@/ts/core';
const { DirectoryTree } = Tree;

/** 移动或复制复选框 */
const CopyOrMoveModal = (props: {
  open: boolean;
  title: string; // 弹出框名称
  currentTaget: IFileSystemItem; // 需要操作的文件
  onChange: (val: boolean) => void;
}) => {
  const { open, title, onChange, currentTaget } = props;
  const [selectNode, setSelectNode] = useState<IFileSystemItem>();
  const treeData = useMemo(() => {
    const loadTreeData = (item: any) => {
      let result: any = {
        key: item.key,
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
    const data = loadTreeData(docsCtrl.root);
    return [data];
  }, [currentTaget]);

  const searchItemByKey = (item: IFileSystemItem, key: string): IObjectItem => {
    if (item.key === key) return item;
    for (const subItem of item.children) {
      const find = searchItemByKey(subItem, key);
      if (find) return find;
    }
    return undefined;
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      open={open}
      onOk={async () => {
        if (selectNode) {
          await selectNode.loadChildren();
          if (title === '移动') {
            if (await currentTaget.move(selectNode)) {
              storeCtrl.currentKey = selectNode.key;
            }
          } else {
            if (await currentTaget?.copy(selectNode)) {
              storeCtrl.currentKey = selectNode.key;
            }
          }
        }
        setSelectNode(undefined);
        onChange(true);
      }}
      onCancel={() => {
        setSelectNode(undefined);
        onChange(false);
      }}>
      {open && treeData && (
        <DirectoryTree
          blockNode
          showIcon
          icon={(node: { expanded: boolean }) => {
            return node.expanded ? (
              <IMFolderOpen color={'#c09553'} />
            ) : (
              <IMFolder color="#c09553" />
            );
          }}
          treeData={treeData}
          onSelect={(keys) => {
            if (keys.length > 0) {
              setSelectNode(searchItemByKey(docsCtrl.root, keys[0].toString()));
            }
          }}
          defaultExpandedKeys={['']}
        />
      )}
    </Modal>
  );
};
export default CopyOrMoveModal;
