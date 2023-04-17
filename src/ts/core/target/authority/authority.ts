import { common, kernel, model, schema } from '@/ts/base';
import { IAuthority } from './iauthority';
import { AuthorityType } from '../../enum';
import consts from '@/ts/core/consts';
import Identity from './identity';
import { PageRequest } from '@/ts/base/model';

export default class Authority implements IAuthority {
  private _belongId: string;
  public readonly target: schema.XAuthority;
  public children: IAuthority[];
  public identitys: Identity[];

  constructor(auth: schema.XAuthority, belongId: string) {
    this.target = auth;
    this._belongId = belongId;
    this.children = [];
    this.identitys = [];
    if (auth.nodes && auth.nodes.length > 0) {
      for (const item of auth.nodes) {
        this.children.push(new Authority(item, belongId));
      }
    }
  }

  private get existAuthority(): string[] {
    return [
      AuthorityType.ApplicationAdmin,
      AuthorityType.SuperAdmin,
      AuthorityType.MarketAdmin,
      AuthorityType.RelationAdmin,
      AuthorityType.ThingAdmin,
    ];
  }
  public get id(): string {
    return this.target.id;
  }
  public get name(): string {
    return this.target.name;
  }
  public get code(): string {
    return this.target.code;
  }
  public get belongId(): string {
    return this.target.belongId;
  }
  public get remark(): string {
    return this.target.remark;
  }
  public async createIdentity(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>> {
    const res = await kernel.createIdentity({
      name,
      code,
      remark,
      authId: this.id,
      belongId: this._belongId,
    });
    if (res.success && res.data != undefined) {
      this.identitys.push(new Identity(res.data));
    }
    return res;
  }
  public async deleteIdentity(id: string): Promise<model.ResultType<any>> {
    const index = this.identitys.findIndex((identity) => {
      return identity.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteIdentity({
        id,
        belongId: this._belongId,
        typeName: '',
      });
      if (res.success) {
        this.identitys = this.identitys.filter((identity) => {
          return identity.id != id;
        });
      }
      return res;
    }
    return model.badRequest(consts.NotFoundError);
  }
  public async createSubAuthority(
    name: string,
    code: string,
    ispublic: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>> {
    if (this.existAuthority.includes(code)) {
      throw new Error(consts.UnauthorizedError);
    }
    const res = await kernel.createAuthority({
      id: undefined,
      name,
      code,
      remark,
      public: ispublic,
      parentId: this.id,
      belongId: this._belongId,
    });
    if (res.success && res.data != undefined) {
      this.children.push(new Authority(res.data, this._belongId));
    }
    return res;
  }
  public async delete(): Promise<model.ResultType<any>> {
    const res = await kernel.deleteAuthority({
      id: this.id,
      belongId: this._belongId,
      typeName: '',
    });
    return res;
  }
  public async deleteSubAuthority(id: string): Promise<model.ResultType<any>> {
    const index = this.children.findIndex((auth) => {
      return auth.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteAuthority({
        id,
        belongId: this._belongId,
        typeName: '',
      });
      if (res.success) {
        this.children = this.children.filter((auth) => {
          return auth.id != id;
        });
      }
      return res;
    }
    return model.badRequest(consts.UnauthorizedError);
  }
  public async updateAuthority(
    name: string,
    code: string,
    ispublic: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>> {
    const res = await kernel.updateAuthority({
      name,
      code,
      remark,
      id: this.target.id,
      public: ispublic,
      belongId: this.target.belongId,
      parentId: this.target.parentId,
    });
    if (res.success) {
      this.target.name = name;
      this.target.code = code;
      this.target.public = ispublic;
      this.target.remark = remark;
      this.target.updateTime = res.data?.updateTime;
    }
    return res;
  }
  public async queryAuthorityIdentity(reload: boolean = false): Promise<Identity[]> {
    if (!reload && this.identitys.length > 0) {
      return this.identitys;
    }
    const res = await kernel.queryAuthorityIdentitys({
      id: this.target.id,
      spaceId: this.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success && res.data.result) {
      this.identitys = res.data.result.map((a) => {
        return new Identity(a);
      });
    }
    return this.identitys;
  }
  public async queryAuthorityPerson(
    spaceId: string,
    page: PageRequest,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.queryPersonByAuthority({
      id: this.target.id,
      spaceId: spaceId,
      page: page,
    });
  }
}
