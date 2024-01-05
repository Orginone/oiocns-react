import { Executor, FormData } from '.';

/**
 * 外部链接
 */
export class Webhook extends Executor {
  async execute(data: FormData): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
