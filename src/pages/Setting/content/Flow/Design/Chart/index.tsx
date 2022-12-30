import cls from './index.module.less';
import FlowDrawer from './FlowDrawer';
import ProcessTree from './ProcessTree';
import React, { useEffect, useState } from 'react';
import { AddNodeType, conditionDataType } from './FlowDrawer/processType';
import processCtrl, { ConditionCallBackTypes } from '../../Controller/processCtrl';

interface IProps {
  scale?: number;
  conditions?: conditionDataType; //内置条件选择器
}

const ProcessDesign: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(100);
  const [currentNode, setCurrentNode] = useState<{ type: AddNodeType }>({
    type: AddNodeType.APPROVAL,
  });

  useEffect(() => {
    setScale(props.scale ?? 100);
  }, [props]);

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
