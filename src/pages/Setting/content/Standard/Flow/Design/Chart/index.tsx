import cls from './index.module.less';
import FlowDrawer from './FlowDrawer';
import ProcessTree from './ProcessTree';
import React, { useEffect, useState } from 'react';
import { AddNodeType, FieldCondition, NodeType } from './FlowDrawer/processType';
import { ISpeciesItem } from '@/ts/core';

interface IProps {
  operateOrgId?: string;
  designOrgId?: string;
  scale?: number;
  resource: any;
  conditions?: FieldCondition[]; //内置条件选择器
  species?: ISpeciesItem;
  defaultEditable: boolean;
}

const ChartDesign: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(100);
  const [currentNode, setCurrentNode] = useState<NodeType>();
  useEffect(() => {
    setScale(props.scale ?? 100);
  }, [props]);

  return (
    <div className={cls['container']}>
      <div className={cls['layout-body']}>
        <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
          <div className={cls['design']} style={{ transform: `scale(${scale / 100})` }}>
            {/* 树结构展示 */}
            <ProcessTree
              defaultEditable={props.defaultEditable}
              operateOrgId={props.operateOrgId}
              conditions={props.conditions}
              resource={props.resource}
              onSelectedNode={(params) => {
                if (
                  params.type !== AddNodeType.CONCURRENTS &&
                  params.type !== AddNodeType.ORGANIZATIONA
                ) {
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
        defaultEditable={props.defaultEditable}
        species={props.species}
        operateOrgId={props.operateOrgId}
        designOrgId={props.designOrgId}
        isOpen={
          isOpen && (props.defaultEditable || currentNode?.task?.records?.length > 0)
        }
        current={currentNode}
        conditions={props.conditions}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ChartDesign;
