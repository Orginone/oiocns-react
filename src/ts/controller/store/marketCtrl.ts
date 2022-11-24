import Provider from '../../core/provider';
class MarketController {
  /** 当前用户 */
  public get userId() {
    return Provider.userId;
  }
}
const marketCtrl = new MarketController();
export { marketCtrl };
