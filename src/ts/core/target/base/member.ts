import { OperateModel } from '@/ts/base/model';
import { model, schema } from '../../../base';
import { FileInfo, IFile, IFileInfo } from '../../thing/fileinfo';
import {
  TargetType,
  entityOperates,
  fileOperates,
  memberOperates,
  targetOperates,
  teamOperates,
} from '../../public';
import { ITarget } from './target';
import { Directory, IDirectory } from '../../thing/directory';
import { ISession } from '../../chat/session';

/** 成员接口类 */
export interface IMemeber extends IFileInfo<schema.XTarget> {
  /** 是否为成员 */
  isMember: boolean;
  /** 成员会话 */
  session: ISession | undefined;
  /** 成员的用户 */
  target: ITarget;
}

/** 成员实现类 */
export class Member extends FileInfo<schema.XTarget> implements IMemeber {
  constructor(_metadata: schema.XTarget, _target: ITarget) {
    super(_metadata, _target.directory);
  }
  isMember: boolean = true;
  get cacheFlag(): string {
    return 'members';
  }
  get groupTags(): string[] {
    return ['成员'];
  }
  get session(): ISession | undefined {
    if (this.id === this.userId) {
      return this.target.user.session;
    }
    return this.target.findChat(this.id);
  }
  async rename(_: string): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async copy(destination: IDirectory): Promise<boolean> {
    await destination.target.pullMembers([this.metadata]);
    return true;
  }
  async move(_: IDirectory): Promise<boolean> {
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
    if (this.session) {
      operates.unshift(targetOperates.Chat);
    }
    return operates;
  }
}

export class MemberDirectory extends Directory {
  constructor(_target: ITarget) {
    super(
      {
        ..._target.directory.metadata,
        typeName: '成员目录',
        id: _target.id + '__',
        name:
          _target.typeName === TargetType.Person ? '我的好友' : `${_target.typeName}成员`,
      },
      _target,
      _target.directory,
    );
  }
  get superior(): IFile {
    return this.target;
  }
  override content(): IFile[] {
    if (this.target.session.isMyChat || this.target.hasRelationAuth()) {
      return this.target.members
        .map((i) => new Member(i, this.target))
        .sort((a, b) => (a.metadata.updateTime < b.metadata.updateTime ? 1 : -1));
    }
    return [];
  }
  override async loadContent(reload: boolean = false): Promise<boolean> {
    return await this.target.loadContent(reload);
  }
  override operates(): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    if (this.target.hasRelationAuth()) {
      if (this.target.user.copyFiles.size > 0) {
        operates.push(fileOperates.Parse);
      }
      if (this.target.id === this.target.userId) {
        operates.push(targetOperates.JoinFriend);
      } else {
        operates.push(teamOperates.Pull);
      }
      operates.push(memberOperates.SettingIdentity);
      if ('superAuth' in this.target) {
        operates.unshift(memberOperates.SettingAuth);
        if ('stations' in this.target) {
          operates.unshift(memberOperates.SettingStation);
        }
      }
    }
    return operates;
  }
}
