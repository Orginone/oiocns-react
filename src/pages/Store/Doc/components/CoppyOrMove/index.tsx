import React, { Key } from 'react';
import { useState } from 'react';
import { Modal, message, Tree } from 'antd';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';

const ResetNameModal = (props: {
  open: boolean;
  treeData: any[];
  title: string; // 弹出框名称
  currentTaget: any; // 需要操作的文件
  onSelect: (keys: string[]) => void;
  onChange: (val: boolean) => void;
}) => {
  const { open, title, onChange, treeData, currentTaget, onSelect } = props;
  const [keys, setKeys] = useState<string>('');
  const [selectNode, setSelectNode] = useState<any>();
  const handleSelect = (selectedKeys: Key[], { selected }: { selected: boolean }) => {
    if (selected) {
      setSelectNode(docsCtrl.refItem(selectedKeys.toString()));
      setKeys(selectedKeys.toString());
      onSelect(selectedKeys as string[]);
    } else {
      setSelectNode(undefined);
    }
  };
  return (
    <Modal
      destroyOnClose
      title={'"' + currentTaget.title + '"' + title}
      open={open}
      onOk={async () => {
        if (keys) {
          if (title === '移动到') {
            if (await docsCtrl.refItem(currentTaget.key)?.move(selectNode)) {
              docsCtrl.changCallback();
            } else {
              message.error('更新失败，请稍后重试');
            }
          } else {
            if (await docsCtrl.refItem(currentTaget.key)?.copy(selectNode)) {
              docsCtrl.changCallback();
            } else {
              message.error('更新失败，请稍后重试');
            }
          }
        }
        onChange(false);
      }}
      onCancel={() => {
        setKeys('');
        setSelectNode(undefined);
        onChange(false);
      }}>
      {open && (
        <Tree
          blockNode
          showIcon
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
