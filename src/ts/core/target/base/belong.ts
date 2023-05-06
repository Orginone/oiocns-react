import { schema, kernel, model } from '../../../base';
import { PageAll } from '../../public/consts';
import { SpeciesType, TargetType } from '../../public/enums';
import { IDict, Dict } from '../../thing/dict/dict';
import { IAuthority, Authority } from '../authority/authority';
import { Cohort, ICohort } from '../outTeam/cohort';
import { IPerson } from '../person';
import { ITarget, Target } from './target';
import { IChatMessage, ChatMessage } from '../../chat/message/message';

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
  /** 加载群 */
  loadCohorts(reload?: boolean): Promise<ICohort[]>;
  /** 加载超管权限 */
  loadSuperAuth(reload?: boolean): Promise<IAuthority | undefined>;
  /** 加载元数据字典 */
  loadDicts(reload?: boolean): Promise<IDict[]>;
  /** 申请加用户 */
  applyJoin(members: schema.XTarget[]): Promise<boolean>;
  /** 添加字典 */
  createDict(data: model.DictModel): Promise<IDict | undefined>;
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
    this.speciesTypes.unshift(SpeciesType.PropClass);
    this.message = new ChatMessage(this);
  }
  user: IPerson;
  dicts: IDict[] = [];
  cohorts: ICohort[] = [];
  message: IChatMessage;
  superAuth: IAuthority | undefined;
  private _dictLoaded: boolean = false;
  async loadSuperAuth(reload: boolean = false): Promise<IAuthority | undefined> {
    if (!this.superAuth || reload) {
      const res = await kernel.queryAuthorityTree({
        id: this.metadata.id,
        page: PageAll,
      });
      if (res.success && res.data?.id) {
        this.superAuth = new Authority(res.data, this);
      }
    }
    return this.superAuth;
  }
  async loadDicts(reload: boolean = false): Promise<IDict[]> {
    if (!this._dictLoaded || reload) {
      const res = await kernel.queryDicts({
        id: this.metadata.id,
        page: PageAll,
      });
      if (res.success) {
        this._dictLoaded = true;
        this.dicts = (res.data.result || []).map((item) => {
          return new Dict(item, this);
        });
      }
    }
    return this.dicts;
  }
  async createDict(data: model.DictModel): Promise<IDict | undefined> {
    data.belongId = this.metadata.id;
    const res = await kernel.createDict(data);
    if (res.success && res.data?.id) {
      const dict = new Dict(res.data, this);
      this.dicts.push(dict);
      return dict;
    }
  }
  async createCohort(data: model.TargetModel): Promise<ICohort | undefined> {
    data.typeName = TargetType.Cohort;
    const metadata = await this.create(data);
    if (metadata) {
      const cohort = new Cohort(metadata, this);
      if (this.metadata.typeName != TargetType.Person) {
        if (!(await this.pullSubTarget(cohort))) {
          return;
        }
      }
      this.cohorts.push(cohort);
      await cohort.pullMembers([this.user.metadata]);
      return cohort;
    }
  }
  abstract get parentTarget(): ITarget[];
  abstract applyJoin(members: schema.XTarget[]): Promise<boolean>;
  abstract loadCohorts(reload?: boolean | undefined): Promise<ICohort[]>;
}
