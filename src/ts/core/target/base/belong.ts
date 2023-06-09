import { schema, kernel, model } from '../../../base';
import { PageAll } from '../../public/consts';
import { SpeciesType, TargetType } from '../../public/enums';
import { IAuthority, Authority } from '../authority/authority';
import { Cohort, ICohort } from '../outTeam/cohort';
import { IPerson } from '../person';
import { ITarget, Target } from './target';
import { IChatMessage, ChatMessage } from '../../chat/message/chatmsg';
import { IMsgChat, PersonMsgChat } from '../../chat/message/msgchat';
import { IDict } from '../../thing/dict/dict';
import { IDictClass } from '../../thing/dict/dictclass';
import { IFileSystem, FileSystem } from '../../thing/filesys/filesystem';

/** 自归属用户接口类 */
export interface IBelong extends ITarget {
  /** 当前用户 */
  user: IPerson;
  /** 归属的消息 */
  message: IChatMessage;
  /** 超管权限，权限为树结构 */
  superAuth: IAuthority | undefined;
  /** 元数据字典 */
  dicts: IDict[];
  /** 加入/管理的群 */
  cohorts: ICohort[];
  /** 上级用户 */
  parentTarget: ITarget[];
  /** 群会话 */
  cohortChats: IMsgChat[];
  /** 共享组织 */
  shareTarget: ITarget[];
  /** 文件系统 */
  filesys: IFileSystem;
  /** 加载字典 */
  loadDicts(): Promise<IDict[]>;
  /** 加载群 */
  loadCohorts(reload?: boolean): Promise<ICohort[]>;
  /** 加载超管权限 */
  loadSuperAuth(reload?: boolean): Promise<IAuthority | undefined>;
  /** 申请加用户 */
  applyJoin(members: schema.XTarget[]): Promise<boolean>;
  /** 设立人员群 */
  createCohort(data: model.TargetModel): Promise<ICohort | undefined>;
}

/** 自归属用户基类实现 */
export abstract class Belong extends Target implements IBelong {
  constructor(
    _metadata: schema.XTarget,
    _labels: string[],
    _user?: IPerson,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_metadata, _labels, undefined, _memberTypes);
    this.user = _user || (this as unknown as IPerson);
    this.speciesTypes = [
      SpeciesType.Dict,
      SpeciesType.Store,
      SpeciesType.Thing,
      SpeciesType.Application,
    ];
    this.message = new ChatMessage(this);
    this.filesys = new FileSystem(this);
  }
  user: IPerson;
  dicts: IDict[] = [];
  filesys: IFileSystem;
  cohorts: ICohort[] = [];
  message: IChatMessage;
  superAuth: IAuthority | undefined;
  async loadDicts(): Promise<IDict[]> {
    const dicts: IDict[] = [];
    for (const item of this.species) {
      switch (item.typeName) {
        case SpeciesType.Dict: {
          const subDicts = await (item as IDictClass).loadAllDicts();
          for (const item of subDicts) {
            if (dicts.findIndex((i) => i.id === item.id) < 0) {
              dicts.push(item);
            }
          }
        }
      }
    }
    this.dicts = dicts;
    return dicts;
  }
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
      const cohort = new Cohort(metadata, this);
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
  override loadMemberChats(_newMembers: schema.XTarget[], _isAdd: boolean): void {
    _newMembers = _newMembers.filter((i) => i.id != this.userId);
    if (_isAdd) {
      const labels = this.id === this.user.id ? ['好友'] : [this.name, '同事'];
      _newMembers.forEach((i) => {
        if (!this.memberChats.some((a) => a.id === i.id)) {
          this.memberChats.push(new PersonMsgChat(i, labels, this));
        }
      });
    } else {
      this.memberChats = this.memberChats.filter((i) =>
        _newMembers.every((a) => a.id != i.chatId),
      );
    }
  }
  abstract get shareTarget(): ITarget[];
  abstract cohortChats: IMsgChat[];
  abstract get parentTarget(): ITarget[];
  abstract applyJoin(members: schema.XTarget[]): Promise<boolean>;
  abstract loadCohorts(reload?: boolean | undefined): Promise<ICohort[]>;
}
