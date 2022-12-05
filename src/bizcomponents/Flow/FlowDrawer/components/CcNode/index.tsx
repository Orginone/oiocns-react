import React, { useState } from 'react';
import { Row, Button } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import cls from './index.module.less';

/**
 * @description: 抄送对象
 * @return {*}
 */

const CcNode = () => {
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectPost, setSelectPost] = useState();
  const onOk = (params: any) => {
    selectedNode.props.assignedUser = [{ name: params.node.name, id: params.node.id }];
    setSelectedNode(selectedNode);
    setSelectPost(params);
    setIsOpen(false);
  };
  const onCancel = () => {
    setIsOpen(false);
  };
  // 选择抄送对象
  const rovalnode = (
    <div className={cls[`roval-node`]}>
      <Row>
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setIsOpen(true);
          }}>
          选择抄送对象
        </Button>
        {selectPost ? (
          <span>
            当前选择：<a>{selectPost?.node.name}</a>
          </span>
        ) : null}
      </Row>
    </div>
  );
  return (
    <div className={cls[`app-roval-node`]}>
      {rovalnode}
      <PersonCustomModal
        open={isOpen}
        title={'选择岗位'}
        onOk={onOk}
        onCancel={onCancel}
      />
    </div>
  );
};
export default CcNode;
