import React, { useEffect, useState } from 'react';
import ProcessTree from './ProcessTree';
import FlowDrawer from './FlowDrawer';
import { AddNodeType, conditionDataType } from '@/ts/controller/setting/processType';
import processCtrl, { ConditionCallBackTypes } from '@/ts/controller/setting/processCtrl';

import cls from './index.module.less';

type ProcessDesignProps = {
  editorValue?: string; //编辑的数据
  conditionData?: conditionDataType; //内置条件选择器
};

const ProcessDesign: React.FC<ProcessDesignProps> = ({ editorValue }) => {
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
              editorValue={editorValue || '{}'}
              onSelectedNode={(params) => {
                processCtrl.setCurrentNode(params);
                //设置当前操作的节点，后续都是对当前节点的操作
                setCurrentNode(params);
                setIsOpen(true);
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
