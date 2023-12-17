import { model } from '@/ts/base';
import { Controller } from '@/ts/controller';
import { IWorkTask } from '../..';

export type FormData = Map<string, model.FormEditData>;

// 执行器
export interface IExecutor {
  // 控制器
  command: Controller;
  // 元数据
  metadata: model.Executor;
  // 当前任务
  task: IWorkTask;
  // 进度
  progress: number;
  // 执行
  execute(data: FormData): Promise<boolean>;
}

export abstract class Executor implements IExecutor {
  constructor(metadata: model.Executor, task: IWorkTask) {
    this.command = new Controller(metadata.id);
    this.metadata = metadata;
    this.task = task;
    this.progress = 0;
  }
  command: Controller;
  metadata: model.Executor;
  task: IWorkTask;
  progress: number;
  abstract execute(data: FormData): Promise<boolean>;
}
