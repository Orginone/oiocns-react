import BaseTarget from '../../core/target/base';
import { IAuthority } from './../../core/target/authority/iauthority';
import BaseController from '../baseCtrl';

class AuthorityController extends BaseController {
  private _callbacks: (() => void)[] = [];
  private _root: IAuthority | undefined;
  private _curAuthority: IAuthority | undefined;

  constructor() {
    super();
  }

  public get authority() {
    return this._curAuthority;
  }

  public OnAuthorityChanged(callback: () => void) {
    if (callback) {
      if (this._curAuthority) {
        callback.apply(this, []);
      }
      this._callbacks.push(callback);
    }
  }

  public async setTarget(target: BaseTarget) {
    this._root = await target.selectAuthorityTree();
    this._curAuthority = this._root;
    this.changCallback();
  }

  /**
   * 设置当前职权
   * @param authroity 职权
   */
  public async setCurAuthority(authroity: IAuthority): Promise<void> {
    if (this._root && this.judgeIsExist(authroity?.id, this._root!)) {
      this._curAuthority = authroity;
      this._callbacks.forEach((c) => {
        c.apply(this, []);
      });
      this.changCallback();
    }
  }

  /** 判断职权是否存在 */
  private async judgeIsExist(id: string, authroity: IAuthority) {
    const auths = await authroity.getSubAuthoritys();
    return (
      auths.find(async (a) => {
        if (a.id == id) {
          return true;
        } else {
          return await this.judgeIsExist(id, a);
        }
      }) != undefined
    );
  }
}

export const authroity = new AuthorityController();
