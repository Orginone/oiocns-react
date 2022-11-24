import BaseController from './SingletonPublish';
class SettingController extends BaseController { 
  private _isOpenModal: boolean = false;
   /** 页面isOpen控制是否显示弹窗 */
   public get getIsOpen() {
    return this._isOpenModal;
   }
  /**设弹窗 */ 
  public async setIsOpen(params: boolean) {
    console.log(params);
    this._isOpenModal = params;
  }
}
const settingController = new SettingController();

export default settingController;