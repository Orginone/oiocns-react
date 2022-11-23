import { common, faildResult, kernel, model, schema } from '../../../base';
import { IAuthority } from './iauthority';
import Provider from '../../provider';
import Identity from './identity';
import consts from '../../consts';

export default class Authority implements IAuthority {
  public get id(): string {
    return this._authority.id;
  }
  public children: Authority[];
  public identitys: Identity[];

  private readonly _authority: schema.XAuthority;

  constructor(auth: schema.XAuthority) {
    this._authority = auth;
    this.children = [];
    this.identitys = [];
  }
  public async createIdentity(
    name: string,
    code: string,
    authId: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>> {
    const res = await kernel.createIdentity({
      name,
      code,
      authId,
      remark,
      id: undefined,
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
  public async getSubAuthoritys(): Promise<Authority[]> {
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
