import { ITransfer } from '@/ts/core';
import { Basecoat, Graph, Path, Platform, Node } from '@antv/x6';
import { Selection } from '@antv/x6-plugin-selection';
import { register } from '@antv/x6-react-shape';
import React from 'react';
import { GraphNode, ProcessingNode } from './node';
import { model } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { Options } from '@antv/x6/lib/graph/options';

/**
 * 创建画布
 * @param ref html 元素引用
 * @param link 迁移配置数据
 * @returns
 */
export const createGraph = (
  ref: React.RefObject<HTMLDivElement>,
  options?: Partial<Options.Manual>,
): Graph => {
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
    ...options,
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
  let ports = {
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
  };
  register({
    shape: 'data-processing-dag-node',
    width: 180,
    height: 48,
    component: ProcessingNode,
    ports: ports,
  });
  register({
    shape: 'data-processing-dag-graph-node',
    width: 600,
    height: 300,
    component: GraphNode,
    ports: ports,
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
export class Store extends Basecoat<{}> implements Graph.Plugin {
  name: string;
  transfer: ITransfer;

  constructor(transfer: ITransfer) {
    super();
    this.name = 'TransferStore';
    this.transfer = transfer;
  }

  init(_graph: Graph, ..._: any[]) {}
}

/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @param dx
 * @param dy
 * @returns
 */
const getNextNodePos = (node: Node, graph: Graph, dx = 250, dy = 100) => {
  // 找出画布中以该起始节点为起点的相关边的终点id集合
  const downstreamNodeIdList: string[] = [];
  graph.getEdges().forEach((edge) => {
    const originEdge = edge.toJSON();
    if (originEdge.source.cell === node.id) {
      downstreamNodeIdList.push(originEdge.target);
    }
  });
  // 获取起点的位置信息
  const position = node.getPosition();
  let minX = Infinity;
  let maxY = -Infinity;
  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition();
      // 找到所有节点中最左侧的节点的x坐标
      if (nodePosition.x < minX) {
        minX = nodePosition.x;
      }
      // 找到所有节点中最x下方的节点的y坐标
      if (nodePosition.y > maxY) {
        maxY = nodePosition.y;
      }
    }
  });

  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y,
  };
};

/**
 * 创建节点
 * @param data 数据
 * @returns 节点
 */
export const createNode = (data: model.Node): Node.Metadata => {
  const node: Node.Metadata = {
    id: data.id,
    shape: 'data-processing-dag-node',
    data: data,
    ports: [
      {
        id: `${data.id}-in`,
        group: 'in',
      },
      {
        id: `${data.id}-out`,
        group: 'out',
      },
    ],
  };
  return node;
};

/**
 * 创建节点容器
 * @param data 数据
 * @returns 容器
 */
export const createGraphNode = (data: model.Node): Node.Metadata => {
  const node: Node.Metadata = {
    id: data.id,
    shape: 'data-processing-dag-graph-node',
    data: data,
    ports: [
      {
        id: `${data.id}-in`,
        group: 'in',
      },
      {
        id: `${data.id}-out`,
        group: 'out',
      },
    ],
  };
  return node;
};

/**
 * 创建边并添加到画布
 * @param source
 * @param target
 * @param graph
 */
export const createEdge = (source: string, target: string, graph: Graph) => {
  const edge = {
    ...generateEdge(),
    source: {
      cell: source,
      port: `${source}-out`,
    },
    target: {
      cell: target,
      port: `${target}-in`,
    },
  };
  if (graph) {
    graph.addEdge(edge);
  }
};

// 创建下游的节点和边
export const createDownstream = (graph: Graph, node: Node, data: model.Node) => {
  const position = getNextNodePos(node, graph);
  const nextNode = createNode(data);
  nextNode.x = position.x;
  nextNode.y = position.y;
  const newNode = graph.addNode(nextNode);
  createEdge(node.id, newNode.id, graph);
};

// 创建边
export const generateEdge = () => {
  return {
    id: generateUuid(),
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeDasharray: '5 5',
      },
    },
    zIndex: -1,
    connector: 'smooth',
  };
};
