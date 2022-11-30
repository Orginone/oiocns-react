import React, { Key, useMemo } from 'react';
import { useState } from 'react';
import { Modal, message, Tree } from 'antd';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import { getIcon } from '../CommonMenu';

const { DirectoryTree } = Tree;

const ResetNameModal = (props: {
  open: boolean;
  title: string; // 弹出框名称
  currentTaget: any; // 需要操作的文件
  onChange: (val: boolean) => void;
}) => {
  const { open, title, onChange, currentTaget } = props;
  const [keys, setKeys] = useState<string>('');
  const [selectNode, setSelectNode] = useState<any>();
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
        if (keys) {
          if (title === '移动到') {
            if (await docsCtrl.refItem(currentTaget.key)?.move(selectNode)) {
              docsCtrl.changCallback();
              message.success('移动文件成功');
            } else {
              message.error('移动失败，请稍后重试');
            }
          } else {
            if (await docsCtrl.refItem(currentTaget.key)?.copy(selectNode)) {
              docsCtrl.changCallback();
              message.success('复制文件成功');
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
          icon={getIcon}
          treeData={treeData}
          onSelect={handleSelect}
          selectedKeys={[keys]}
          defaultExpandedKeys={['']}
        />
      )}
    </Modal>
  );
};
export default ResetNameModal;
