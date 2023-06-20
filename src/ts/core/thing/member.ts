import { OperateModel } from '@/ts/base/model';
import { schema } from '../../base';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';
import { targetOperates } from '../public';

/** 成员接口类 */
export interface IMemeber extends IFileInfo<schema.XTarget> {
  /** 是否为成员 */
  isMember: boolean;
  /** 成员会话Id */
  fullId: string;
}

/** 成员实现类 */
export class Member extends FileInfo<schema.XTarget> implements IMemeber {
  constructor(_metadata: schema.XTarget, _directory: IDirectory) {
    super(_metadata, _directory);
  }
  isMember: boolean = true;
  get fullId(): string {
    return `${this.directory.belongId}-${this._metadata.id}`;
  }
  async rename(name: string): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async copy(destination: IDirectory): Promise<boolean> {
    await destination.target.pullMembers([this.metadata]);
    return true;
  }
  async move(destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async delete(): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  override operates(): OperateModel[] {
    const operates = super.operates(1);
    if (
      this.metadata.id != this.directory.belongId &&
      this.directory.target.hasRelationAuth()
    ) {
      operates.unshift({
        sort: 59,
        cmd: 'copy',
        label: '分配成员',
        iconType: 'copy',
      });
      operates.unshift({
        sort: 60,
        cmd: 'remove',
        label: '移除成员',
        iconType: 'remove',
      });
    }
    if (this.metadata.id != this.directory.target.userId) {
      operates.unshift(targetOperates.Chat);
    }
    return operates;
  }
}
