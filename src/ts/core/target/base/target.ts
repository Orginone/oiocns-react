import { schema, model, kernel } from '../../../base';
import { IIdentity, Identity } from '../identity/identity';
import { SpeciesType, TargetType } from '../../public/enums';
import { PageAll } from '../../public/consts';
import { ISpeciesItem, createSpecies } from '../../thing/';
import { ITeam, Team } from './team';
import { IBelong } from './belong';

/** 用户抽象接口类 */
export interface ITarget extends ITeam {
  /** 用户设立的身份(角色) */
  identitys: IIdentity[];
  /** 用户设立的管理类别 */
  species: ISpeciesItem[];
  /** 支持的类别类型 */
  speciesTypes: string[];
  /** 子用户 */
  subTarget: ITarget[];
  /** 所有相关用户 */
  targets: ITarget[];
  /** 退出用户群 */
  exit(): Promise<boolean>;
  /** 加载用户设立的身份(角色)对象 */
  loadIdentitys(reload?: boolean): Promise<IIdentity[]>;
  /** 加载用户设立的管理类别 */
  loadSpecies(reload?: boolean): Promise<ISpeciesItem[]>;
  /** 为用户设立身份 */
  createIdentity(data: model.IdentityModel): Promise<IIdentity | undefined>;
  /** 为用户设立管理类别 */
  createSpecies(data: model.SpeciesModel): Promise<ISpeciesItem | undefined>;
}

/** 用户基类实现 */
export abstract class Target extends Team implements ITarget {
  constructor(
    _metadata: schema.XTarget,
    _labels: string[],
    _space?: IBelong,
    _memberTypes: TargetType[] = [TargetType.Person],
  ) {
    super(_metadata, _labels, _space, _memberTypes);
    this.speciesTypes = [SpeciesType.Application, SpeciesType.Resource];
  }
  speciesTypes: string[] = [];
  identitys: IIdentity[] = [];
  species: ISpeciesItem[] = [];
  private _identityLoaded: boolean = false;
  private _speciesLoaded: boolean = false;
  async loadIdentitys(reload?: boolean | undefined): Promise<IIdentity[]> {
    if (!this._identityLoaded || reload) {
      const res = await kernel.queryTargetIdentitys({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._identityLoaded = true;
        this.identitys = (res.data.result || []).map((item) => {
          return new Identity(item, this.space);
        });
      }
    }
    return this.identitys;
  }
  async loadSpecies(reload?: boolean | undefined): Promise<ISpeciesItem[]> {
    if (!this._speciesLoaded || reload) {
      const res = await kernel.querySpeciesTree({
        id: this.id,
        upTeam: this.metadata.typeName === TargetType.Group,
        belongId: this.space.id,
        filter: '',
      });
      if (res.success) {
        this._speciesLoaded = true;
        this.species = (res.data.result || [])
          .map((i) => createSpecies(i, this))
          .filter((i) => i != undefined)
          .map((i) => i!);
      }
    }
    return this.species;
  }
  async createIdentity(data: model.IdentityModel): Promise<IIdentity | undefined> {
    data.shareId = this.id;
    const res = await kernel.createIdentity(data);
    if (res.success && res.data?.id) {
      const identity = new Identity(res.data, this.space);
      this.identitys.push(identity);
      return identity;
    }
  }
  async createSpecies(data: model.SpeciesModel): Promise<ISpeciesItem | undefined> {
    data.shareId = this.id;
    data.parentId = '0';
    const res = await kernel.createSpecies(data);
    if (res.success && res.data?.id) {
      const species = createSpecies(res.data, this);
      if (species) {
        this.species.push(species);
      }
      return species;
    }
  }
  protected async pullSubTarget(team: ITeam): Promise<boolean> {
    const res = await kernel.pullAnyToTeam({
      id: this.id,
      subIds: [team.id],
    });
    return res.success;
  }
  abstract exit(): Promise<boolean>;
  abstract get targets(): ITarget[];
  abstract get subTarget(): ITarget[];
  createTarget(_data: model.TargetModel): Promise<ITeam | undefined> {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
