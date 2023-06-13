import cls from './index.module.less';
import FlowDrawer from './FlowDrawer';
import ProcessTree from './ProcessTree';
import React, { useState } from 'react';
import { AddNodeType, NodeModel } from '../processType';
import { IWorkDefine } from '@/ts/core';
import { schema } from '@/ts/base';

interface IProps {
  scale?: number;
  isEdit: boolean;
  resource: NodeModel;
  current?: IWorkDefine;
  instance?: schema.XWorkInstance;
}

const ChartDesign: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentNode, setCurrentNode] = useState<NodeModel>();

  return (
    <div className={cls['container']}>
      <div className={cls['layout-body']}>
        <div style={{ height: 'calc(100vh - 250px )', overflowY: 'auto' }}>
          <div
            className={cls['design']}
            style={{ transform: `scale(${(props.scale ?? 100) / 100})` }}>
            {/* 树结构展示 */}
            <ProcessTree
              define={props.current}
              isEdit={props.isEdit}
              resource={props.resource}
              onSelectedNode={(params) => {
                if (
                  params.type !== AddNodeType.CONCURRENTS &&
                  params.type !== AddNodeType.ORGANIZATIONA
                ) {
                  //设置当前操作的节点，后续都是对当前节点的操作
                  setCurrentNode(params);
                  setIsOpen(
                    props.instance == undefined ||
                      props.instance.tasks?.find((a) => a.nodeId == params.id) !=
                        undefined,
                  );
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
          instance={props.instance}
          forms={currentNode.forms || []}
          define={props.current}
          defaultEditable={props.isEdit}
          isOpen={isOpen}
          current={currentNode}
          onClose={() => {
            setCurrentNode(undefined);
          }}
        />
      )}
    </div>
  );
};

export default ChartDesign;
