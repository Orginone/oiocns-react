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
