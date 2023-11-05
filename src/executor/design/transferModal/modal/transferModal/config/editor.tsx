import { ITransfer } from '@/ts/core';
import { Options } from '@antv/x6/lib/graph/options';
import { message } from 'antd';
import React, { createRef, useEffect } from 'react';
import { Store, createGraph } from '../cells/graph';
import cls from './../index.module.less';

export interface IProps {
  current: ITransfer;
  options?: Partial<Options.Manual>;
}

/**
 * 返回一个图编辑器
 * @returns
 */
const Editor: React.FC<IProps> = ({ current, options }) => {
  const ref = createRef<HTMLDivElement>();
  useEffect(() => {
    const graph = createGraph(ref, options);
    graph.use(new Store(current));
    if (current.metadata.graph) {
      graph.fromJSON(current.metadata.graph);
    }
    graph.centerContent();
    graph.on('node:added', async (args) => {
      current.nodes.push(args.cell.getData());
      current.command.emitter('tools', 'update', args.cell.getData());
    });
    graph.on('node:removed', async (args) => {
      const index = current.nodes.findIndex((item) => item.id == args.cell.id);
      if (index != -1) {
        current.nodes.splice(index, 1);
      }
    });
    graph.on('node:contextmenu', (a) =>
      current.command.emitter('node', 'contextmenu', a),
    );
    graph.on('node:click', (a) => current.command.emitter('node', 'click', a));
    graph.on('edge:change:target', async (args) => {
      if ((args.current as any)?.cell) {
        current.edges.push({
          id: args.edge.id,
          start: args.edge.getSourceCellId(),
          end: args.edge.getTargetCellId(),
        });
        if (current.hasLoop()) {
          message.error('检测到存在环状结构，自动删除！');
          graph.removeEdge(args.cell.id);
        }
      }
    });
    graph.on('edge:removed', async (args) => {
      const index = current.edges.findIndex((item) => item.id == args.cell.id);
      if (index != -1) {
        current.edges.splice(index, 1);
      }
    });
    graph.on('edge:mouseenter', ({ cell }: any) => {
      cell.addTools([
        { name: 'vertices' },
        {
          name: 'button-remove',
          args: { distance: 20 },
        },
      ]);
    });
    graph.on('edge:mouseleave', ({ cell }: any) => {
      if (cell.hasTool('button-remove')) {
        cell.removeTool('button-remove');
      }
      if (cell.hasTool('vertices')) {
        cell.removeTool('vertices');
      }
    });
    graph.on('blank:click', (a) => current.command.emitter('blank', 'click', a));
    graph.on('blank:contextmenu', (a) =>
      current.command.emitter('blank', 'contextmenu', a),
    );
    current.getData = () => graph.toJSON();
    setTimeout(() => current.command.emitter('tools', 'initialized', graph), 200);
    const id = current.command.subscribe((type: string, cmd: string) => {
      if (type != 'graph') return;
      switch (cmd) {
        case 'center':
          graph.centerContent();
          break;
        case 'refresh':
          graph.fromJSON(current.metadata.graph);
          break;
      }
    });
    return () => {
      current.command.unsubscribe(id);
      current.getData = undefined;
      graph.off();
      graph.dispose();
    };
  }, [ref]);
  return <div className={cls.link} ref={ref} />;
};

export default Editor;
