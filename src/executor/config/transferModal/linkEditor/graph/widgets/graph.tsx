import { ITransfer } from '@/ts/core';
import { Basecoat, Graph, Path, Platform } from '@antv/x6';
import { Selection } from '@antv/x6-plugin-selection';
import { register } from '@antv/x6-react-shape';
import React from 'react';
import { generateEdge } from './edge';
import { ProcessingNode } from './node';

/**
 * 创建画布
 * @param ref html 元素引用
 * @param link 链接数据
 * @returns
 */
export const createGraph = (ref: React.RefObject<HTMLDivElement>): Graph => {
  const graph: Graph = new Graph({
    container: ref.current!,
    grid: true,
    autoResize: true,
    panning: true,
    mousewheel: true,
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6',
            strokeWidth: 4,
          },
        },
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      highlight: true,
      allowLoop: false,
      sourceAnchor: {
        name: 'left',
        args: {
          dx: Platform.IS_SAFARI ? 4 : 8,
        },
      },
      targetAnchor: {
        name: 'right',
        args: {
          dx: Platform.IS_SAFARI ? 4 : -8,
        },
      },
      createEdge() {
        return graph.createEdge(generateEdge());
      },
      validateConnection({ sourceMagnet, targetMagnet }) {
        if (sourceMagnet?.getAttribute('port-group') === 'in') {
          return false;
        }
        return targetMagnet?.getAttribute('port-group') === 'in';
      },
    },
    background: {
      color: '#F2F7FA',
    },
  });
  using(graph);
  registering();
  return graph;
};

/**
 * 注册自定义组件
 */
const registering = () => {
  Graph.registerConnector(
    'curveConnector',
    (sourcePoint, targetPoint) => {
      const gap = Math.abs(targetPoint.x - sourcePoint.x);
      const path = new Path();
      path.appendSegment(Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y));
      path.appendSegment(Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y));
      // 水平三阶贝塞尔曲线
      path.appendSegment(
        Path.createSegment(
          'C',
          sourcePoint.x < targetPoint.x
            ? sourcePoint.x + gap / 2
            : sourcePoint.x - gap / 2,
          sourcePoint.y,
          sourcePoint.x < targetPoint.x
            ? targetPoint.x - gap / 2
            : targetPoint.x + gap / 2,
          targetPoint.y,
          targetPoint.x - 6,
          targetPoint.y,
        ),
      );
      path.appendSegment(Path.createSegment('L', targetPoint.x + 2, targetPoint.y));
      return path.serialize();
    },
    true,
  );
  register({
    shape: 'data-processing-dag-node',
    width: 180,
    height: 48,
    component: ProcessingNode,
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
        out: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#C2C8D5',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
        },
      },
    },
  });
};

/**
 * 使用插件
 * @param graph 画布
 */
const using = (graph: Graph) => {
  graph.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      pointerEvents: 'none',
      modifiers: ['shift'],
    }),
  );
};

/** 临时存储插件 */
export class LinkStore extends Basecoat<{}> implements Graph.Plugin {
  name: string;
  link: ITransfer;

  constructor(link: ITransfer) {
    super();
    this.name = 'LinkStore';
    this.link = link;
  }

  init(_graph: Graph, ..._: any[]) {}
}
