import { kernel } from '@/ts/base';
import { Executor } from '.';
import orgCtrl from '@/ts/controller';

/**
 * 外部链接
 */
export class Webhook extends Executor {
  async execute(): Promise<boolean> {
    this.changeProgress(0);
    await kernel.httpForward({
      uri: this.metadata.hookUrl,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      content: JSON.stringify({
        taskData: this.task.taskdata,
        person: orgCtrl.user.metadata,
        belong: this.task.belong.metadata,
        instanceData: this.task.instanceData,
      }),
    });
    this.changeProgress(100);
    return true;
  }
}
