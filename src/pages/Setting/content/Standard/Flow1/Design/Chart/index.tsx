import cls from './index.module.less';
import FlowDrawer from './FlowDrawer';
import ProcessTree from './ProcessTree';
import React, { useEffect, useState } from 'react';
import { FieldCondition, NodeData } from './FlowDrawer/processType';
import { ISpeciesItem } from '@/ts/core';
import { XFlowDefine } from '@/ts/base/schema';
import { NodeType } from '../enum';

interface IProps {
  current: XFlowDefine | undefined;
  operateOrgId?: string;
  designOrgId?: string;
  scale?: number;
  resource: any;
  conditions?: FieldCondition[]; //内置条件选择器
  species?: ISpeciesItem;
  defaultEditable: boolean;
  disableIds: string[];
}

const ChartDesign: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(100);
  const [currentNode, setCurrentNode] = useState<NodeData>();
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
              conditions={props.conditions}
              resource={props.resource}
              onSelectedNode={(params) => {
                if (
                  params.type !== NodeType.CONCURRENTS &&
                  params.type !== NodeType.ORGANIZATIONAL
                ) {
                  //设置当前操作的节点，后续都是对当前节点的操作
                  params.designId = props.current?.id;
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
        disableIds={props.disableIds}
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
