import { kernel, model, schema } from '@/ts/base';
import { formatDate } from '@/ts/base/common';
import { Executor, FormData } from '.';

// 数据领用
export class Acquire extends Executor {
  async execute(data: FormData): Promise<boolean> {
    await this.task.loadInstance();
    const formData = await this.loadContent();
    if (formData) {
      formData.forEach((value, key) => {
        data.set(key, value);
        if (this.task.instanceData) {
          this.task.instanceData.data[key] = [value];
        }
      });
    }
    return true;
  }

  private async loadContent(): Promise<FormData | undefined> {
    const result = await this.loadTask();
    if (result) {
      try {
        let cache: model.ExecutorCache = {};
        if (result.content) {
          cache = JSON.parse(result.content);
        }
        if (cache[this.metadata.id]) {
          return new Map(Object.entries(cache[this.metadata.id]));
        }
        const data = await this.loadCache();
        cache[this.metadata.id] = Object.fromEntries(data.entries());
        result.content = JSON.stringify(cache);
        await this.updateTask(result);
        return data;
      } catch (error) {
        console.log(error);
      }
    }
  }

  private async loadCache(): Promise<FormData> {
    const data: FormData = new Map();
    for (const form of this.task.instanceData?.node.detailForms ?? []) {
      let take = 500;
      let skip = 0;
      let formEditData: model.FormEditData = {
        before: [],
        after: [],
        nodeId: this.task.taskdata.nodeId,
        formName: form.name,
        creator: this.task.userId,
        createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
      };
      while (true) {
        const loadOptions = {
          take: take,
          skip: skip,
          requireTotalCount: true,
          userData: [`F${form.id}`],
          filter: ['belongId', '=', this.task.taskdata.applyId],
        };
        const things = await kernel.loadThing(
          this.task.metadata.belongId,
          [this.task.metadata.belongId],
          loadOptions,
        );
        formEditData.before.push(...things.data);
        formEditData.after.push(...things.data);
        skip += things.data.length;
        if (things.data.length == 0) {
          break;
        }
      }
      data.set(form.id, formEditData);
    }
    return data;
  }

  private async updateTask(data: schema.XWorkTask) {
    return await kernel.collectionReplace(this.task.userId, [], 'work-task', data);
  }

  private async loadTask(): Promise<schema.XWorkTask | undefined> {
    const result = await kernel.collectionLoad<schema.XWorkTask[]>(
      this.task.userId,
      [],
      'work-task',
      {
        options: { match: { id: this.task.id } },
        skip: 0,
        take: 1,
      },
    );
    if (result.data.length > 0) {
      return result.data[0];
    }
  }
}
