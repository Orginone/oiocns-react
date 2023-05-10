import React, { useMemo } from 'react';
import { useState } from 'react';
import { Modal, Tree } from 'antd';
import orgCtrl from '@/ts/controller';
import { ImFolder, ImFolderOpen } from 'react-icons/im';
import { IFileSystemItem } from '@/ts/core';
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
    const loadTreeData = (item: IFileSystemItem) => {
      let result: any = {
        key: item.key,
        title: item.metadata.name,
        children: [],
        isLeaf: !item.metadata.hasSubDirectories,
      };
      if (item.children.length > 0) {
        for (let i = 0; i < item.children.length; i++) {
          if (item.children[i].metadata.isDirectory) {
            result.children.push(loadTreeData(item.children[i]));
          }
        }
      }
      return result;
    };
    const data = loadTreeData(currentTaget.filesys.home!);
    return [data];
  }, [currentTaget]);

  const searchItemByKey = (
    item: IFileSystemItem,
    key: string,
  ): IFileSystemItem | undefined => {
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
              orgCtrl.currentKey = selectNode.key;
            }
          } else {
            if (await currentTaget?.copy(selectNode)) {
              orgCtrl.currentKey = selectNode.key;
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
              <ImFolderOpen color="#c09553" />
            ) : (
              <ImFolder color="#c09553" />
            );
          }}
          treeData={treeData}
          onSelect={(keys) => {
            if (keys.length > 0) {
              setSelectNode(
                searchItemByKey(currentTaget.filesys.home!, keys[0].toString()),
              );
            }
          }}
          defaultExpandedKeys={['']}
        />
      )}
    </Modal>
  );
};
export default CopyOrMoveModal;
