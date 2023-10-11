import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { common, model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import {
  getDefaultMappingNode,
  getDefaultRequestNode,
  getDefaultStoreNode,
  getDefaultTableNode,
  getDefaultTransferNode,
} from '@/ts/core/thing/standard/transfer';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Space } from 'antd';
import React, { createRef, useEffect, useRef } from 'react';
import { createGraphNode, createNode } from '../cells/graph';
import cls from '../index.module.less';

interface IProps {
  current: ITransfer;
}

const Nodes: React.FC<IProps> = ({ current }) => {
  const graph = useRef<Graph>();
  const dndRef = createRef<HTMLDivElement>();
  const dnd = useRef<Dnd>();
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type != 'tools') return;
      switch (cmd) {
        case 'initialized':
          graph.current = args as Graph;
          if (graph.current) {
            dnd.current = new Dnd({
              target: args,
              scaled: false,
              dndContainer: dndRef.current ?? undefined,
              getDragNode: (node) => node.clone({ keepId: true }),
              getDropNode: (node) => {
                const data = node.getData() as model.Node;
                if (data.typeName == '子图') {
                  return graph.current!.createNode(createGraphNode(data));
                } else {
                  return node.clone({ keepId: true });
                }
              },
            });
          }
          break;
        case 'copy':
          {
            const newNode: model.Node = common.deepClone(args);
            if (graph.current) {
              for (let node of graph.current.getNodes()) {
                let position = node.getPosition();
                if (node.id == newNode.id) {
                  newNode.id = common.generateUuid();
                  graph.current.addNode({
                    ...createNode(newNode),
                    x: position.x + 10,
                    y: position.y + 10,
                  });
                }
              }
            }
          }
          break;
        case 'delete':
          if (graph.current) {
            for (let node of graph.current.getNodes()) {
              if (node.id == args.id) {
                node.remove();
              }
            }
          }
          break;
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  const start = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    name: model.NodeType,
  ) => {
    let data = {} as model.Node;
    switch (name) {
      case '表格':
        data = getDefaultTableNode();
        break;
      case '请求':
        data = getDefaultRequestNode();
        break;
      case '存储':
        data = getDefaultStoreNode();
        break;
      case '映射':
        data = getDefaultMappingNode();
        break;
      case '子图':
        data = getDefaultTransferNode();
        break;
    }
    let node = graph.current?.createNode(createNode(data));
    if (node) {
      dnd.current?.start(node, e.nativeEvent as any);
    }
  };
  const Node: React.FC<{ name: model.NodeType }> = ({ name }) => {
    return (
      <Space
        onMouseDown={(e) => start(e, name)}
        className={`${cls.node} ${cls.contextBorder}`}>
        <EntityIcon />
        {name}
      </Space>
    );
  };
  return (
    <div className={cls.draggableNodes} ref={dndRef}>
      <Space
        className={`${cls.dataSourceNode} ${cls.border}`}
        direction="vertical"
        align="center">
        {'数据源'}
        <Node name="表单" />
        <Node name="表格" />
        <Node name="请求" />
      </Space>
      <Space
        className={`${cls.operateNode} ${cls.border}`}
        direction="vertical"
        align="center">
        {'数据操作'}
        <Node name="子图" />
        <Node name="映射" />
        <Node name="存储" />
      </Space>
    </div>
  );
};

export default Nodes;
