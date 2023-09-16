import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import {
  getDefaultTransferNode,
  getDefaultMappingNode,
  getDefaultRequestNode,
  getDefaultStoreNode,
} from '@/ts/core/thing/standard/transfer';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Space } from 'antd';
import React, { createRef, useEffect, useRef } from 'react';
import { createNode } from '../../graph/widgets/node';
import cls from './../../index.module.less';

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
          dnd.current = new Dnd({
            target: args,
            scaled: false,
            dndContainer: dndRef.current ?? undefined,
            getDragNode: (node) => node.clone({ keepId: true }),
            getDropNode: (node) => node.clone({ keepId: true }),
          });
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
    let data = {} as model.Node<any>;
    switch (name) {
      case '请求':
        data = getDefaultRequestNode();
        break;
      case '存储':
        data = getDefaultStoreNode();
        break;
      case '映射':
        data = getDefaultMappingNode();
        break;
      case '链接':
        data = getDefaultTransferNode();
        break;
    }
    const node = graph.current?.createNode(createNode(data));
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
    <div className={`${cls.nodes} ${cls.border}`} ref={dndRef}>
      <Space direction="vertical">
        <Node name="请求" />
        <Node name="链接" />
        <Node name="映射" />
        <Node name="存储" />
      </Space>
    </div>
  );
};

export default Nodes;
