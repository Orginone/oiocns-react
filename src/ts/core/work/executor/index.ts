import { Command, model } from '@/ts/base';
import { IWorkTask } from '../..';

export type FormData = Map<string, model.FormEditData>;

// 执行器
export interface IExecutor {
  // 控制器
  command: Command;
  // 元数据
  metadata: model.Executor;
  // 当前任务
  task: IWorkTask;
  // 执行
  execute(data: FormData): Promise<boolean>;
}

export abstract class Executor implements IExecutor {
  constructor(metadata: model.Executor, task: IWorkTask) {
    this.command = new Command();
    this.metadata = metadata;
    this.task = task;
  }
  command: Command;
  metadata: model.Executor;
  task: IWorkTask;
  abstract execute(data: FormData): Promise<boolean>;
}
