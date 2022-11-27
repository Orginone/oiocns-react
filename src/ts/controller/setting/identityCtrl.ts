import { authroity } from './authorityCtrl';
import BaseController from '../baseCtrl';
import { IIdentity } from '../../core/target/authority/iidentity';

class IdentityController extends BaseController {
  private _identitys: IIdentity[] | undefined;
  private _curIdentity: IIdentity | undefined;

  constructor() {
    super();
    authroity.OnAuthorityChanged(async () => {
      await this._initialization();
    });
  }
  private async _initialization() {
    this._identitys = await authroity.authority?.queryAuthorityIdentity();
    this.changCallback();
  }

  public get curIdentity() {
    return this._curIdentity;
  }

  public get identitys() {
    return this.identitys;
  }

  public setCurrent(identity: IIdentity) {
    if (this._identitys?.includes(identity)) {
      this._curIdentity = identity;
      this.changCallback();
    }
  }
}

export const identity = new IdentityController();
