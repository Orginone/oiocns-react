/*
 * @Author: zhangqiang 1196217890@qq.com
 * @Date: 2022-11-21 15:15:12
 * @LastEditors: zhangqiang 1196217890@qq.com
 * @LastEditTime: 2022-11-21 15:15:37
 * @FilePath: /oiocns-react/src/pages/Person/_control/basecontroller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Provider from '@/ts/core/provider';
import Person from '@/ts/core/target/person';

/**
 * 控制器的基类
 */
abstract class BaseController {
  // 获取登录的用户
  public get getPerson(): Person {
    return Provider.getPerson;
  }
}

export default BaseController;
