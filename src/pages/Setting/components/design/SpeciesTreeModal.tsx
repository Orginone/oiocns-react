import { ISpeciesItem, loadSpeciesTree } from '@/ts/core/thing';
import { Modal, Tree } from 'antd';
import React, { useEffect, useState } from 'react';

type SpeciesTreeModalProps = {
  open: boolean;
  spaceId: string;
  speciesIds: string[];
  handleCancel: () => void;
  handleOk: (success: boolean, species: any[]) => void;
};
/**
 * 类别选择模态框
 */
const SpeciesTreeModal: React.FC<SpeciesTreeModalProps> = ({
  open,
  spaceId,
  speciesIds,
  handleCancel,
  handleOk,
}) => {
  const [treeData, setTreeData] = useState<ISpeciesItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(speciesIds);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [checkedNodes, setCheckedNodes] = useState<any[]>([]);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[], info: any) => {
    setCheckedKeys(checkedKeysValue);
    setCheckedNodes(info.checkedNodes);
  };

  useEffect(() => {
    const loadTree = async () => {
      const res = await loadSpeciesTree(spaceId);
      setTreeData(res?.children || []);
    };
    loadTree();
  }, [spaceId]);

  return (
    <Modal
      title={'请选择类别作为子表'}
      open={open}
      destroyOnClose={true}
      onOk={() => handleOk(true, checkedNodes)}
      onCancel={handleCancel}
      maskClosable={false}
      width={780}>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
        checkStrictly={true}
        fieldNames={{ title: 'name', key: 'id', children: 'children' }}
      />
    </Modal>
  );
};

export default SpeciesTreeModal;
