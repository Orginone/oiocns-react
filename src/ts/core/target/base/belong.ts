import { schema, kernel, model } from '../../../base';
import { PageAll } from '../../public/consts';
import { TargetType } from '../../public/enums';
import { IAuthority, Authority } from '../authority/authority';
import { Cohort, ICohort } from '../outTeam/cohort';
import { ITarget, Target } from './target';
import { ISession, Session } from '../../chat/session';
import { targetOperates } from '../../public';
import { IStorage } from '../outTeam/storage';
import { IPerson } from '../person';

/** 自归属用户接口类 */
export interface IBelong extends ITarget {
  /** 超管权限，权限为树结构 */
  superAuth: IAuthority | undefined;
  /** 加入/管理的群 */
  cohorts: ICohort[];
  /** 存储资源群 */
  storages: IStorage[];
  /** 上级用户 */
  parentTarget: ITarget[];
  /** 群会话 */
  cohortChats: ISession[];
  /** 共享组织 */
  shareTarget: ITarget[];
  /** 获取存储占用情况 */
  getDiskInfo(): Promise<model.DiskInfoType | undefined>;
  /** 加载超管权限 */
  loadSuperAuth(reload?: boolean): Promise<IAuthority | undefined>;
  /** 申请加用户 */
  applyJoin(members: schema.XTarget[]): Promise<boolean>;
  /** 设立人员群 */
  createCohort(data: model.TargetModel): Promise<ICohort | undefined>;
  /** 发送职权变更消息 */
  sendAuthorityChangeMsg(operate: string, authority: schema.XAuthority): Promise<boolean>;
}

/** 自归属用户基类实现 */
export abstract class Belong extends Target implements IBelong {
  constructor(
    _metadata: schema.XTarget,
    _relations: string[],
    _user?: IPerson,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super([], _metadata, _relations, undefined, _user, _memberTypes);
    kernel.subscribe(
      `${_metadata.belongId}-${_metadata.id}-authority`,
      [this.key],
      (data: any) => this.superAuth?.receiveAuthority(data),
    );
  }
  cohorts: ICohort[] = [];
  storages: IStorage[] = [];
  superAuth: IAuthority | undefined;
  async loadSuperAuth(reload: boolean = false): Promise<IAuthority | undefined> {
    if (!this.superAuth || reload) {
      const res = await kernel.queryAuthorityTree({
        id: this.id,
        page: PageAll,
      });
      if (res.success && res.data?.id) {
        this.superAuth = new Authority(res.data, this);
      }
    }
    return this.superAuth;
  }
  async createCohort(data: model.TargetModel): Promise<ICohort | undefined> {
    data.typeName = TargetType.Cohort;
    const metadata = await this.create(data);
    if (metadata) {
      const cohort = new Cohort(metadata, this, metadata.belongId);
      await cohort.deepLoad();
      if (this.typeName != TargetType.Person) {
        if (!(await this.pullSubTarget(cohort))) {
          return;
        }
      }
      this.cohorts.push(cohort);
      await cohort.pullMembers([this.user.metadata]);
      return cohort;
    }
  }
  async getDiskInfo(): Promise<model.DiskInfoType | undefined> {
    const res = await kernel.diskInfo(this.id, this.relations);
    if (res.success && res.data) {
      return res.data;
    }
  }
  override loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    _newMembers = _newMembers.filter((i) => i.id != this.userId);
    if (_isAdd) {
      const labels = this.id === this.user.id ? ['好友'] : [this.name, '同事'];
      _newMembers.forEach((i) => {
        if (!this.memberChats.some((a) => a.id === i.id)) {
          this.memberChats.push(new Session(i.id, this, i, labels));
        }
      });
    } else {
      this.memberChats = this.memberChats.filter((i) =>
        _newMembers.every((a) => a.id != i.sessionId),
      );
    }
  }
  async loadContent(reload: boolean = false): Promise<boolean> {
    await super.loadContent(reload);
    await this.loadSuperAuth(reload);
    return true;
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(targetOperates.NewCohort);
    }
    return operates;
  }
  abstract get shareTarget(): ITarget[];
  abstract cohortChats: ISession[];
  abstract get parentTarget(): ITarget[];
  abstract applyJoin(members: schema.XTarget[]): Promise<boolean>;
  async sendAuthorityChangeMsg(
    operate: string,
    authority: schema.XAuthority,
  ): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: {
        operate,
        authority,
        operater: this.user.metadata,
      },
      flag: 'authority',
      onlineOnly: true,
      belongId: this.metadata.belongId,
      relations: this.relations,
      onlyTarget: true,
      ignoreSelf: true,
      targetId: this.metadata.id,
    });
    return res.success;
  }
}
