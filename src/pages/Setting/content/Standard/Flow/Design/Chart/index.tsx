import cls from './index.module.less';
import FlowDrawer from './FlowDrawer';
import ProcessTree from './ProcessTree';
import React, { useState } from 'react';
import { AddNodeType, NodeType } from './FlowDrawer/processType';
import { IWorkDefine } from '@/ts/core';

interface IProps {
  current: IWorkDefine;
  scale?: number;
  resource: any;
  defaultEditable: boolean;
}

const ChartDesign: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentNode, setCurrentNode] = useState<NodeType>();

  return (
    <div className={cls['container']}>
      <div className={cls['layout-body']}>
        <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
          <div
            className={cls['design']}
            style={{ transform: `scale(${(props.scale ?? 100) / 100})` }}>
            {/* 树结构展示 */}
            <ProcessTree
              belongId={props.current.workItem.belongId}
              defaultEditable={props.defaultEditable}
              resource={props.resource}
              onSelectedNode={(params) => {
                if (
                  params.type !== AddNodeType.CONCURRENTS &&
                  params.type !== AddNodeType.ORGANIZATIONA
                ) {
                  //设置当前操作的节点，后续都是对当前节点的操作
                  params.designId = props.current.id;
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
      {currentNode && (
        <FlowDrawer
          forms={props.resource.props.operations}
          define={props.current}
          defaultEditable={props.defaultEditable}
          isOpen={
            isOpen && (props.defaultEditable || currentNode?.task?.records?.length > 0)
          }
          current={currentNode!}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChartDesign;
