import { OperateModel } from '@/ts/base/model';
import { schema } from '../../base';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';
import { entityOperates, memberOperates, targetOperates } from '../public';

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
  get cacheFlag(): string {
    return 'members';
  }
  get groupTags(): string[] {
    return ['成员'];
  }
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
  async hardDelete(): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  override operates(): OperateModel[] {
    const operates = [entityOperates.Remark, entityOperates.QrCode];
    if (
      this.metadata.id != this.directory.belongId &&
      this.directory.target.hasRelationAuth()
    ) {
      operates.unshift(memberOperates.Copy, memberOperates.Remove);
    }
    if (this.metadata.id != this.directory.target.userId) {
      operates.unshift(targetOperates.Chat);
    }
    return operates;
  }
}
