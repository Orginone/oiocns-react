import React, { useEffect, useState } from 'react';
import ProcessTree from './ProcessTree';
import FlowDrawer from './FlowDrawer';
import { AddNodeType, conditionDataType } from '../Controller/processType';
import processCtrl, { ConditionCallBackTypes } from '../Controller/processCtrl';

import cls from './index.module.less';

type ProcessDesignProps = {
  conditionData?: conditionDataType; //内置条件选择器
};

const ProcessDesign: React.FC<ProcessDesignProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentNode, setCurrentNode] = useState<{ type: AddNodeType }>({
    type: AddNodeType.APPROVAL,
  });
  const [scale, setScale] = useState<number>(100);

  const refreshUI = () => {
    setScale(processCtrl.scale);
  };
  useEffect(() => {
    const id = processCtrl.subscribePart(ConditionCallBackTypes.Scale, refreshUI);
    return () => {
      processCtrl.unsubscribe(id);
    };
  }, []);

  return (
    <div className={cls['container']}>
      <div className={cls['layout-body']}>
        <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
          <div className={cls['design']} style={{ transform: `scale(${scale / 100})` }}>
            {/* 树结构展示 */}
            <ProcessTree
              onSelectedNode={(params) => {
                if (params.type !== AddNodeType.CONCURRENTS) {
                  processCtrl.setCurrentNode(params);
                  //设置当前操作的节点，后续都是对当前节点的操作
                  setCurrentNode(params);
                  setIsOpen(true);
                } else {
                  return false;
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* 侧边数据填充 */}
      <FlowDrawer
        isOpenFlow={isOpen}
        selectNodeType={currentNode?.type}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ProcessDesign;
