import React, { Key, useMemo } from 'react';
import { useState } from 'react';
import { Modal, message, Tree } from 'antd';
import storeCtrl from '@/ts/controller/store';
import { IMFolder, IMFolderOpen } from '@icongo/im';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { IFileSystemItem } from '@/ts/core';

const { DirectoryTree } = Tree;

const ResetNameModal = (props: {
  open: boolean;
  title: string; // 弹出框名称
  currentTaget: IFileSystemItem | undefined; // 需要操作的文件
  onChange: (val: boolean) => void;
}) => {
  const { open, title, onChange, currentTaget } = props;
  const [keys, setKeys] = useState<string>();
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
  }, [currentTaget, keys]);
  const handleSelect = async (
    selectedKeys: Key[],
    { selected }: { selected: boolean },
  ) => {
    if (selected) {
      const node = docsCtrl.refItem(selectedKeys.toString());
      await node?.loadChildren(false);
      setSelectNode(node);
      setKeys(selectedKeys.toString());
    } else {
      setSelectNode(undefined);
    }
  };
  const hideModal = () => {
    setKeys('');
    setSelectNode(undefined);
    onChange(false);
  };
  return (
    <Modal
      destroyOnClose
      title={'"' + currentTaget?.name + '"' + title}
      open={open}
      onOk={async () => {
        if (keys !== undefined && selectNode) {
          if (title === '移动到') {
            if (await currentTaget?.move(selectNode)) {
              message.success('移动文件成功');
              storeCtrl.currentKey = selectNode.key;
              storeCtrl.changCallback();
            } else {
              message.error('移动失败，请稍后重试');
            }
          } else {
            if (await currentTaget?.copy(selectNode)) {
              message.success('移动文件成功');
              storeCtrl.currentKey = selectNode.key;
              storeCtrl.changCallback();
            } else {
              message.error('复制失败，请稍后重试');
            }
          }
        }
        hideModal();
      }}
      onCancel={() => {
        hideModal();
      }}>
      {open && treeData && (
        <DirectoryTree
          blockNode
          showIcon
          icon={(node: { expanded: boolean }) => {
            return node.expanded ? (
              <IMFolderOpen color="#c09553" />
            ) : (
              <IMFolder color="#c09553" />
            );
          }}
          treeData={treeData}
          onSelect={handleSelect}
          selectedKeys={keys !== undefined ? [keys] : []}
          defaultExpandedKeys={['']}
        />
      )}
    </Modal>
  );
};
export default ResetNameModal;
