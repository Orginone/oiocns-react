import consts from '../consts';
import { TargetType } from '../enum';
import { appendTarget } from './targetMap';
import { kernel, model, common, schema, parseAvatar } from '../../base';
import Authority from './authority/authority';
import { IAuthority } from './authority/iauthority';
import { IIdentity } from './authority/iidentity';
import { ITarget, TargetParam } from './itarget';
import Identity from './authority/identity';
import { generateUuid, logger, sleep } from '@/ts/base/common';
import { XTarget, XTargetArray } from '@/ts/base/schema';
import { TargetModel, TargetShare } from '@/ts/base/model';
import { ISpeciesItem } from './species/ispecies';
import { SpeciesItem } from './species/species';
export default class BaseTarget implements ITarget {
  public key: string;
  public typeName: TargetType;
  public subTeamTypes: TargetType[] = [];
  protected memberTypes: TargetType[] = [TargetType.Person];
  public readonly target: schema.XTarget;
  public speciesTree: ISpeciesItem | undefined;
  public authorityTree: Authority | undefined;
  public ownIdentitys: schema.XIdentity[];
  public identitys: IIdentity[];

  public createTargetType: TargetType[];
  public joinTargetType: TargetType[];
  public searchTargetType: TargetType[];

  public get id(): string {
    return this.target.id;
  }
  public get name(): string {
    return this.target.name;
  }
  public get teamName(): string {
    return this.target.team?.name ?? this.name;
  }

  public get subTeam(): ITarget[] {
    return [];
  }

  public get shareInfo(): TargetShare {
    const result: TargetShare = {
      name: this.teamName,
      typeName: this.typeName,
    };
    result.avatar = parseAvatar(this.target.avatar);
    return result;
  }

  constructor(target: schema.XTarget) {
    this.key = generateUuid();
    this.target = target;
    this.createTargetType = [];
    this.joinTargetType = [];
    this.searchTargetType = [];
    this.ownIdentitys = [];
    this.identitys = [];
    this.typeName = target.typeName as TargetType;
    appendTarget(target);
  }
  delete(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async loadMembers(page: model.PageRequest): Promise<XTargetArray> {
    const res = await kernel.querySubTargetById({
      page: {
        limit: page.limit,
        offset: page.offset,
        filter: page.filter,
      },
      id: this.target.id,
      typeNames: [this.target.typeName],
      subTypeNames: this.memberTypes,
    });
    appendTarget(res.data);
    return res.data;
  }
  async pullMember(target: XTarget): Promise<boolean> {
    return this.pullMembers([target.id], target.typeName);
  }
  async pullMembers(ids: string[], type: TargetType | string): Promise<boolean> {
    const targetType: TargetType = type as TargetType;
    if (this.memberTypes.includes(targetType)) {
      const res = await kernel.pullAnyToTeam({
        id: this.target.id,
        targetIds: ids,
        targetType: targetType,
        teamTypes: [this.target.typeName],
      });
      return res.success;
    }
    return false;
  }
  async removeMember(target: XTarget): Promise<boolean> {
    return this.removeMembers([target.id], target.typeName);
  }
  async removeMembers(ids: string[], type: TargetType | string): Promise<boolean> {
    const targetType: TargetType = type as TargetType;
    if (this.memberTypes.includes(targetType)) {
      const res = await kernel.removeAnyOfTeam({
        id: this.target.id,
        targetIds: ids,
        targetType: targetType,
        teamTypes: [this.target.typeName],
      });
      return res.success;
    }
    return false;
  }
  async loadSubTeam(_: boolean): Promise<ITarget[]> {
    await sleep(0);
    return [];
  }
  public async pullSubTeam(team: XTarget): Promise<boolean> {
    if (this.subTeamTypes.includes(team.typeName as TargetType)) {
      const res = await kernel.pullAnyToTeam({
        id: this.target.id,
        targetIds: [team.id],
        targetType: team.typeName,
        teamTypes: [this.target.typeName],
      });
      return res.success;
    }
    return false;
  }
  async createIdentity(
    params: Omit<model.IdentityModel, 'id' | 'belongId'>,
  ): Promise<IIdentity | undefined> {
    const res = await kernel.createIdentity({
      ...params,
      belongId: this.target.id,
    });
    if (res.success && res.data != undefined) {
      const newItem = new Identity(res.data);
      this.identitys.push(newItem);
      return newItem;
    }
  }
  async deleteIdentity(id: string): Promise<boolean> {
    const index = this.identitys.findIndex((item) => {
      return item.id === id;
    });
    if (index > -1) {
      const res = await kernel.deleteIdentity({
        id: id,
        typeName: this.target.typeName,
        belongId: this.target.id,
      });
      if (res.success) {
        this.identitys = this.identitys.filter((obj) => {
          return obj.id != id;
        });
      }
      return res.success;
    }
    return false;
  }
  async getIdentitys(): Promise<IIdentity[]> {
    if (this.identitys.length > 0) {
      return this.identitys;
    }
    const res = await kernel.queryTargetIdentitys({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success && res.data && res.data.result) {
      this.identitys = res.data.result.map((item) => {
        return new Identity(item);
      });
    }
    return this.identitys;
  }

  protected async createSubTarget(
    data: Omit<model.TargetModel, 'id'>,
  ): Promise<model.ResultType<schema.XTarget>> {
    if (this.createTargetType.includes(data.typeName as TargetType)) {
      const res = await this.createTarget(data);
      if (res.success) {
        await kernel.pullAnyToTeam({
          id: this.target.id,
          teamTypes: [this.target.typeName],
          targetIds: [res.data?.id],
          targetType: <TargetType>data.typeName,
        });
      }
      return res;
    }
    return model.badRequest(consts.UnauthorizedError);
  }

  protected async deleteSubTarget(
    id: string,
    typeName: string,
    spaceId: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteTarget({
      id: id,
      typeName: typeName,
      belongId: spaceId,
    });
  }

  protected async deleteTarget(): Promise<model.ResultType<any>> {
    return await kernel.deleteTarget({
      id: this.id,
      typeName: this.target.typeName,
      belongId: this.target.belongId,
    });
  }

  /**
   * 根据编号查询组织/个人
   * @param code 编号
   * @param TypeName 类型
   * @returns
   */
  protected async searchTargetByName(
    code: string,
    typeNames: TargetType[],
  ): Promise<schema.XTargetArray> {
    typeNames = this.searchTargetType.filter((a) => {
      return typeNames.includes(a);
    });
    if (typeNames.length > 0) {
      const res = await kernel.searchTargetByName({
        name: code,
        typeNames: typeNames,
        page: {
          offset: 0,
          filter: code,
          limit: common.Constants.MAX_UINT_16,
        },
      });
      appendTarget(res.data);
      return res.data;
    }
    logger.warn(consts.UnauthorizedError);
    return { total: 0, offset: 0, limit: 0, result: undefined };
  }

  /**
   * 申请加入组织/个人 (好友申请除外)
   * @param destId 加入的组织/个人id
   * @param typeName 对象
   * @returns
   */
  public async applyJoin(destId: string, typeName: TargetType): Promise<boolean> {
    if (this.joinTargetType.includes(typeName)) {
      const res = await kernel.applyJoinTeam({
        id: destId,
        targetId: this.target.id,
        teamType: typeName,
        targetType: this.target.typeName,
      });
      return res.success;
    }
    logger.warn(consts.UnauthorizedError);
    return false;
  }

  /**
   * 取消加入组织/个人
   * @param id 申请Id/目标Id
   * @returns
   */
  protected async cancelJoinTeam(id: string): Promise<model.ResultType<any>> {
    return await kernel.cancelJoinTeam({
      id,
      belongId: this.target.id,
      typeName: this.target.typeName,
    });
  }

  /**
   * 审批我的加入组织/个人申请
   * @param id
   * @param status
   * @returns
   */
  protected async approvalJoinApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.joinTeamApproval({
      id,
      status,
    });
  }
  protected async getjoinedTargets(
    typeNames: TargetType[],
    spaceId: string,
  ): Promise<schema.XTargetArray | undefined> {
    typeNames = typeNames.filter((a) => {
      return this.joinTargetType.includes(a);
    });
    if (typeNames.length > 0) {
      return (
        await kernel.queryJoinedTargetById({
          id: this.target.id,
          typeName: this.target.typeName,
          page: {
            offset: 0,
            filter: '',
            limit: common.Constants.MAX_UINT_16,
          },
          spaceId: spaceId,
          JoinTypeNames: typeNames,
        })
      ).data;
    }
  }

  /**
   * 获取子组织/个人
   * @returns 返回好友列表
   */
  protected async getSubTargets(
    typeNames: TargetType[],
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.querySubTargetById({
      id: this.target.id,
      typeNames: [this.target.typeName],
      subTypeNames: typeNames,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 拉自身进组织(创建组织的时候调用)
   * @param target 目标对象
   * @returns
   */
  protected async join(target: schema.XTarget): Promise<model.ResultType<any>> {
    if (this.joinTargetType.includes(<TargetType>target.typeName)) {
      return await kernel.pullAnyToTeam({
        id: this.target.id,
        teamTypes: [target.typeName],
        targetType: this.target.typeName,
        targetIds: [this.target.id],
      });
    }
    return model.badRequest(consts.UnauthorizedError);
  }

  /**
   * 创建对象
   * @param name 名称
   * @param code 编号
   * @param typeName 类型
   * @param teamName team名称
   * @param teamCode team编号
   * @param teamRemark team备注
   * @returns
   */
  protected async createTarget(
    data: Omit<model.TargetModel, 'id'>,
  ): Promise<model.ResultType<schema.XTarget>> {
    if (this.createTargetType.includes(<TargetType>data.typeName)) {
      return await kernel.createTarget({
        ...data,
      });
    } else {
      return model.badRequest(consts.UnauthorizedError);
    }
  }

  async create(_: TargetModel): Promise<ITarget | undefined> {
    await sleep(0);
    return;
  }

  async update(data: TargetParam): Promise<ITarget> {
    await this.updateTarget({
      ...data,
      belongId: this.target.belongId,
      typeName: this.target.typeName,
    });
    return this;
  }

  /**
   * 更新组织、对象
   * @param name 名称
   * @param code 编号
   * @param typeName 类型
   * @param teamName team名称
   * @param teamCode team编号
   * @param teamRemark team备注
   * @returns
   */
  protected async updateTarget(data: Omit<model.TargetModel, 'id'>): Promise<boolean> {
    data.teamCode = data.teamCode == '' ? data.code : data.teamCode;
    data.teamName = data.teamName == '' ? data.name : data.teamName;
    let res = await kernel.updateTarget({
      ...data,
      id: this.target.id,
      typeName: this.target.typeName,
    });
    if (res.success) {
      this.target.name = data.name;
      this.target.code = data.code;
      this.target.avatar = data.avatar;
      this.target.belongId = data.belongId;
      if (this.target.team != undefined) {
        this.target.team.name = data.teamName;
        this.target.team.code = data.teamCode;
        this.target.team.remark = data.teamRemark;
      }
    }
    return res.success;
  }

  /**
   * 判断是否拥有该职权对应身份
   * @param codes 职权编号集合
   */
  async judgeHasIdentity(codes: string[]): Promise<boolean> {
    if (this.ownIdentitys.length == 0) {
      await this.getOwnIdentitys(true);
    }
    return (
      this.ownIdentitys.find((a) => codes.includes(a.authority?.code ?? '')) != undefined
    );
  }

  private async getOwnIdentitys(reload: boolean = false) {
    if (!reload && this.ownIdentitys.length > 0) {
      return this.ownIdentitys;
    }
    const res = await kernel.querySpaceIdentitys({ id: this.target.id });
    if (res.success && res.data.result) {
      this.ownIdentitys = res.data.result;
    }
    return this.ownIdentitys;
  }

  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  public async loadAuthorityTree(
    reload: boolean = false,
  ): Promise<IAuthority | undefined> {
    if (!reload && this.authorityTree != undefined) {
      return this.authorityTree;
    }
    await this.getOwnIdentitys(reload);
    const res = await kernel.queryAuthorityTree({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      this.authorityTree = new Authority(res.data, this.id);
    }
    return this.authorityTree;
  }

  public async loadSpeciesTree(
    reload: boolean = false,
  ): Promise<ISpeciesItem | undefined> {
    if (reload || !this.speciesTree) {
      const res = await kernel.querySpeciesTree(this.id, '');
      if (res.success) {
        this.speciesTree = new SpeciesItem(res.data, undefined);
      }
    }
    return this.speciesTree;
  }

}
