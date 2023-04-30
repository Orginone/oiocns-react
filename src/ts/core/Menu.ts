import { Menulist } from '@/ts/core';
export default class MenuTypeList {
  public GetMenuInfo(code: string) {
    let type: Menulist
    console.log(code);
    switch (code) {
      case "loginout":
        type = {
          type: "loginout",
          fontSize: 18,
          size: 22,
          info: "退出登录",
          typeof: "systemMenu",
          name: "退出登录"
        }
        break
        default:
       type = {
         type: "default",
         fontSize: 18,
         size: 18,
         info: "默认",
         typeof: "systemMenu",
         name: "退出登录"
       }
     break
    }
    return type

  }
}
