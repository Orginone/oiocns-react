import { schema } from '../../../base';
import { ITarget } from '../../target/base/target';
import { IAppModule, AppModule } from './appmodule';
import { IAppPackage } from './package';

/** 应用的抽象接口 */
export interface IApplication extends IAppModule {
  /** 应用类别 */
  package: IAppPackage;
}

/** 应用的基类实现 */
export class Application extends AppModule implements IApplication {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _package: IAppPackage) {
    super(_metadata, _current, _package);
    this.package = _package;
  }
  package: IAppPackage;
}
