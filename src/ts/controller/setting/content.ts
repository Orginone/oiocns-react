/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-19 10:49:44
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 14:41:15
 * @FilePath: /oiocns-react/src/ts/controller/setting/content.ts
 * @Description: 控制器 实例化要调用的接口基类 提供ui层数据
 */
import { LoadChats } from '../../core/chat';
class SettingController  { 

}

export const settingCtrl = new SettingController(await LoadChats());
