import { schema } from '../../../base';
import { ITarget } from '../../target/base/target';
import { IAppModule, AppModule } from './appmodule';

/** 应用的抽象接口 */
export interface IApplication extends IAppModule {}

/** 应用的基类实现 */
export class Application extends AppModule implements IApplication {
  constructor(_metadata: schema.XSpecies, _current: ITarget) {
    super(_metadata, _current);
  }
}
