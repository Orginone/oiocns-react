import { Command, model } from '../../../../base';
import { deepClone, generateUuid } from '../../../../base/common';
import { ITransfer } from './index';
import { INode, createNode } from './node';

type InitStatus = 'Editable' | 'Viewable';

export type VisitedData = { code: string; data: any };

export interface ITask {
  /** 触发器 */
  command: Command;
  /** 迁移配置 */
  transfer: ITransfer;
  /** 元数据 */
  metadata: model.Task;
  /** 已遍历点（存储数据） */
  visitedNodes: Map<string, VisitedData>;
  /** 已遍历边 */
  visitedEdges: Set<string>;
  /** 节点 */
  nodes: INode[];
  /** 前置任务 */
  preTask?: ITask;
  /** 启动状态 */
  status: InitStatus;
  /** 启动事件 */
  event: model.GEvent;
  /** 开始执行 */
  starting(data?: any): Promise<VisitedData[]>;
}

export class Task implements ITask {
  constructor(
    status: InitStatus,
    event: model.GEvent,
    transfer: ITransfer,
    task?: ITask,
  ) {
    this.transfer = transfer;
    this.command = transfer.command;
    this.status = status;
    this.event = event;
    if (task) {
      this.metadata = deepClone({
        ...task.metadata,
        nodes: task.metadata.nodes.map((item) => {
          return {
            ...item,
            status: 'Stop',
          };
        }),
      });
    } else {
      this.metadata = deepClone({
        id: generateUuid(),
        status: status,
        nodes: transfer.metadata.nodes.map((item) => {
          return {
            ...item,
            status: 'Stop',
          };
        }),
        env: transfer.curEnv,
        edges: transfer.metadata.edges,
        graph: transfer.metadata.graph,
        startTime: new Date(),
      });
    }
    this.nodes = this.metadata.nodes.map((item) => createNode(this, item));
    this.visitedNodes = new Map();
    this.visitedEdges = new Set();
    this.preTask = task;
  }

  command: Command;
  transfer: ITransfer;
  metadata: model.Task;
  visitedNodes: Map<string, { code: string; data: any }>;
  visitedEdges: Set<string>;
  nodes: INode[];
  preTask?: ITask;
  status: InitStatus;
  event: model.GEvent;

  async starting(data?: any): Promise<VisitedData[]> {
    if (this.notCompleted()) {
      const not = this.metadata.edges.map((item) => item.end);
      const roots = this.nodes.filter((item) => !not.includes(item.metadata.id));
      return await Promise.all(roots.map((root) => this.visitNode(root, data)));
    }
    return [];
  }

  async visitNode(node: INode, data?: any): Promise<VisitedData> {
    const visitedData = await node.executing(data, this.metadata.env?.params);
    if (this.notCompleted()) {
      const next = await this.next(node);
      if (next) {
        return next;
      }
    }
    return visitedData;
  }

  private preCheck(node: INode): { s: boolean; d: { [key: string]: any } } {
    let data: { [key: string]: any } = {};
    for (const edge of this.metadata.edges) {
      if (node.metadata.id == edge.end) {
        if (!this.visitedEdges.has(edge.id)) {
          return { s: false, d: {} };
        }
        if (this.visitedNodes.has(edge.start)) {
          const nodeData = this.visitedNodes.get(edge.start)!;
          data[nodeData.code] = nodeData.data;
        }
      }
    }
    if (Object.keys(data).length == 1) {
      return { s: true, d: data[Object.keys(data)[0]] };
    }
    return { s: true, d: data };
  }

  async next(preNode: INode): Promise<VisitedData | undefined> {
    for (const edge of this.metadata.edges) {
      if (preNode.metadata.id == edge.start) {
        this.visitedEdges.add(edge.id);
        for (const node of this.nodes) {
          if (node.metadata.id == edge.end) {
            const next = this.preCheck(node);
            if (next.s) {
              return await this.visitNode(node, next.d);
            }
          }
        }
      }
    }
  }

  notCompleted(): boolean {
    return this.visitedNodes.size != this.metadata.nodes.length;
  }
}
