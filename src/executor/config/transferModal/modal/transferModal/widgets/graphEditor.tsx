import { IDirectory, ITransfer } from '@/ts/core';
import { message } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import cls from './../index.module.less';
import { TransferStore, createGraph } from '../cells/graph';
import { Options } from '@antv/x6/lib/graph/options';

export interface IProps {
  current: ITransfer;
  initStatus: 'Editable' | 'Viewable';
  initEvent: 'EditRun' | 'ViewRun';
  options?: Partial<Options.Manual>;
}

const loadProps = async (current: IDirectory) => {
  await current.loadAllTransfer();
  for (const child of current.children) {
    await loadProps(child);
  }
};

/**
 * 返回一个图编辑器
 * @returns
 */
const GraphEditor: React.FC<IProps> = ({ current, initStatus, initEvent, options }) => {
  const ref = createRef<HTMLDivElement>();
  const [initializing, setInitializing] = useState<boolean>(true);
  useEffect(() => {
    if (initializing) {
      let root = current.directory.target.directory;
      loadProps(root).then(() => setInitializing(false));
    } else {
      const graph = createGraph(ref, options);
      graph.use(new TransferStore(current, initStatus, initEvent));
      if (current.metadata.graph) {
        graph.fromJSON(current.metadata.graph);
      }
      graph.centerContent();
      if (initStatus == 'Editable') {
        graph.on('node:added', async (args) => {
          await current.addNode(args.cell.getData());
          current.command.emitter('tools', 'update', args.cell.getData());
        });
        graph.on('node:moved', () => current.update(current.metadata));
        graph.on('node:removed', async (args) => {
          await current.delNode(args.cell.getData().id);
        });
        graph.on('node:contextmenu', (a) =>
          current.command.emitter('node', 'contextmenu', a),
        );
        graph.on('node:click', (a) => current.command.emitter('node', 'click', a));
        graph.on('edge:change:target', async (args) => {
          if ((args.current as any)?.cell) {
            let success: boolean = await current.addEdge({
              id: args.edge.id,
              start: args.edge.getSourceCellId(),
              end: args.edge.getTargetCellId(),
            });
            if (!success) {
              message.error('检测到存在环状结构，自动删除！');
              graph.removeEdge(args.cell.id);
            }
          }
        });
        graph.on('edge:moved', () => current.update(current.metadata));
        graph.on('edge:removed', async (args) => {
          await current.delEdge(args.cell.id);
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
      }
      current.binding(() => graph.toJSON());
      current.command.emitter('tools', 'initialized', graph);
      const id = current.command.subscribe((type: string, cmd: string, _: any) => {
        if (type != 'graph') return;
        switch (cmd) {
          case 'executing':
            current.execute(initStatus, initEvent);
            break;
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
        current.unbinding();
        graph.off();
        graph.dispose();
      };
    }
  }, [ref]);
  return <div className={cls.link} ref={ref} />;
};

export default GraphEditor;
