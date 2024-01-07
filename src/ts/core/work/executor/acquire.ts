import { command, kernel, schema } from '../../../base';
import { Executor } from '.';
import { IWork } from '..';
import { Directory } from '../../thing/directory';
import orgCtrl from '@/ts/controller';

/**
 * 数据申领
 */
export class Acquire extends Executor {
  /**
   * 执行器
   */
  async execute(): Promise<boolean> {
    await this.task.loadInstance();
    const work = await this.task.findWorkById(this.task.taskdata.defineId);
    if (work) {
      const totalCount = await this.getTotalCount(work);
      await this.transfer(work, (p) => {
        this.changeProgress(Number(((p * 100) / totalCount).toFixed(2)));
      });
      this.transferFile(work);
    }
    this.changeProgress(100);
    return true;
  }
  /**
   * 获取总进度
   * @param work 办事
   * @returns 总进度
   */
  private async getTotalCount(work: IWork): Promise<number> {
    const things = await this.loadThing(1, 0, work);
    return things.totalCount;
  }
  /**
   * 迁移数据
   * @param work 办事
   * @param onProgress 进度回调
   */
  private async transfer(work: IWork, onProgress: (p: number) => void) {
    let loaded = 0;
    for (const company of orgCtrl.user.companys) {
      if (company.id == this.task.taskdata.applyId) {
        const thingColl = company.resource.thingColl;
        let take = 500;
        let skip = 0;
        while (true) {
          const things = await this.loadThing(take, skip, work, false);
          await thingColl.replaceMany(things.data);
          skip += things.data.length;
          loaded += things.data.length;
          onProgress(loaded);
          if (things.data.length == 0) {
            break;
          }
        }
      }
    }
  }
  /**
   * 迁移文件
   */
  private async transferFile(work: IWork): Promise<void> {
    const directoryColl = work.application.directory.target.resource.fileDirectoryColl;
    for (const company of orgCtrl.user.companys) {
      if (company.id == this.task.taskdata.applyId) {
        const directories = await directoryColl.loadSpace({
          options: {
            match: {
              code: company.metadata.code,
            },
          },
        });
        if (directories.length > 0) {
          for (const item of directories) {
            const groupDir = new Directory(item, company);
            const children = await company.directory.standard.loadDirectorys();
            let fileDir = children.find((item) => item.name.includes('数据附件'));
            if (!fileDir) {
              const resultDir = await company.directory.create({
                name: '数据附件',
                code: 'dataFile',
                typeName: '目录',
                directoryId: company.id,
              } as schema.XDirectory);
              if (resultDir) {
                fileDir = new Directory(resultDir, company, company.directory);
              }
            }
            if (fileDir) {
              const ready = (await fileDir.loadFiles()).map(
                (item) => item.code.split('/')[1],
              );
              const files = (await groupDir.loadFiles()).filter((item) => {
                return !ready.includes(item.code.split('/')[1]);
              });
              if (files.length > 0) {
                command.emitter('executor', 'taskList', fileDir);
              }
              for (const file of files) {
                const response = await fetch(file.shareInfo().shareLink ?? '');
                if (response.ok) {
                  const blob = await response.blob();
                  fileDir.createFile(new File([blob], file.name, { type: blob.type }));
                }
              }
            }
          }
        }
      }
    }
  }
  /**
   * 加载物
   * @param take 拿几个
   * @param skip 跳过几个
   * @param form 表单
   * @param work 办事
   * @returns 物信息
   */
  private async loadThing(
    take: number,
    skip: number,
    work: IWork,
    requireTotalCount = true,
  ) {
    const loadOptions = {
      take: take,
      skip: skip,
      requireTotalCount: requireTotalCount,
      userData: [],
      filter: ['belongId', '=', this.task.taskdata.applyId],
    };
    return await kernel.loadThing(
      work.application.belongId,
      [this.task.taskdata.applyId, work.application.directory.target.id],
      loadOptions,
    );
  }
}
