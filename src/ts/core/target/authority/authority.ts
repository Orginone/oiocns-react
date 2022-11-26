import { common, faildResult, kernel, model, schema } from '@/ts/base';
import { IAuthority } from './iauthority';
import { AuthorityType } from '../../enum';
import Provider from '@/ts/core/provider';
import consts from '@/ts/core/consts';
import Identity from './identity';

export default class Authority implements IAuthority {
  private readonly _authority: schema.XAuthority;
  public children: IAuthority[];
  public identitys: Identity[];

  constructor(auth: schema.XAuthority) {
    this._authority = auth;
    this.children = [];
    this.identitys = [];
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
    return this._authority.id;
  }
  public get name(): string {
    return this._authority.name;
  }
  public get code(): string {
    return this._authority.code;
  }
  public get belongId(): string {
    return this._authority.belongId;
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
      id: undefined,
      authId: this.id,
      belongId: Provider.spaceId,
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
        belongId: Provider.spaceId,
        typeName: '',
      });
      if (res.success) {
        this.identitys = this.identitys.filter((identity) => {
          return identity.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.NotFoundError);
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
      belongId: Provider.spaceId,
    });
    if (res.success && res.data != undefined) {
      this.children.push(new Authority(res.data));
    }
    return res;
  }
  public async deleteSubAuthority(id: string): Promise<model.ResultType<any>> {
    const index = this.children.findIndex((auth) => {
      return auth.id == id;
    });
    if (index > 0) {
      const res = await kernel.deleteAuthority({
        id,
        belongId: Provider.spaceId,
        typeName: '',
      });
      if (res.success) {
        this.children = this.children.filter((auth) => {
          return auth.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
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
      id: this._authority.id,
      public: ispublic,
      belongId: this._authority.belongId,
      parentId: this._authority.parentId,
    });
    if (res.success) {
      this._authority.name = name;
      this._authority.code = code;
      this._authority.public = ispublic;
      this._authority.remark = remark;
      this._authority.updateTime = res.data?.updateTime;
    }
    return res;
  }
  public async queryAuthorityIdentity(): Promise<Identity[]> {
    if (this.identitys.length > 0) {
      return this.identitys;
    }
    const res = await kernel.queryAuthorityIdentitys({
      id: this._authority.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      res.data.result?.forEach((identity) => {
        this.identitys.push(new Identity(identity));
      });
    }
    return this.identitys;
  }
  public async getSubAuthoritys(): Promise<IAuthority[]> {
    if (this.children.length > 0) {
      return this.children;
    }
    const res = await kernel.querySubAuthoritys({
      id: this._authority.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
    if (res.success) {
      res.data.result?.forEach((auth) => {
        this.children.push(new Authority(auth));
      });
    }
    return this.children;
  }
}
