import Provider from '@/ts/core/provider';
import Person from '../core/target/person';

/**
 * 控制器的基类
 */
abstract class BaseController {

    // 获取登录的用户
    public static get getPerson(): Person {
        return Provider.getPerson;
    }


}

export default BaseController;
