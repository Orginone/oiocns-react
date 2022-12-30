import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import processCtrl from '../../../../../Controller/processCtrl';
import IndentityManage from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';

/**
 * @description: 抄送对象
 * @return {*}
 */

const CcNode = () => {
  const selectedNode = processCtrl.currentNode;
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false); // 打开弹窗
  const [currentData, setCurrentData] = useState<{
    data: { id: string; name: string };
    title: string;
    key: string;
  }>({ title: '', key: '', data: { id: '', name: '' } });

  const onOk = () => {
    selectedNode.props.assignedUser = [
      { name: currentData.title, id: currentData.data.id },
    ];
    processCtrl.setCurrentNode(selectedNode);
    setIsApprovalOpen(false);
  };

  const onCancel = () => {
    setIsApprovalOpen(false);
  };

  // 选择抄送对象
  const rovalnode = (
    <div className={cls[`roval-node`]}>
      <div style={{ marginBottom: '10px' }}>
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setIsApprovalOpen(true);
          }}>
          选择抄送对象
        </Button>
      </div>
      <div>
        {currentData?.title ? (
          <span>
            当前选择：<a>{currentData?.title}</a>
          </span>
        ) : null}
      </div>
    </div>
  );
  return (
    <div className={cls[`app-roval-node`]}>
      {rovalnode}
      <Modal
        title="添加身份"
        key="addApproval"
        open={isApprovalOpen}
        destroyOnClose={true}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        width="650px">
        <IndentityManage
          multiple={false}
          onChecked={(params: any) => {
            selectedNode.props.assignedUser = [
              { name: params.title, id: params.data.id },
            ];
            processCtrl.setCurrentNode(selectedNode);
            setCurrentData(params);
          }}
        />
      </Modal>
    </div>
  );
};
export default CcNode;
