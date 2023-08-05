import { schema } from '../../base';
import { OperateModel } from '../../base/model';
import { personJoins, targetOperates } from '../public';
import { IPerson } from '../target/person';
import { Directory, IDirectory } from './directory';
import { IFileInfo } from './fileinfo';

export interface IDisk extends IDirectory {
  user: IPerson;
}

export class Disk extends Directory implements IDisk {
  constructor(_user: IPerson) {
    super(_user.directory.metadata, _user);
    this.user = _user;
  }

  user: IPerson;
  override content(mode?: number): IFileInfo<schema.XEntity>[] {
    return [this.user, ...this.user.companys];
  }

  override operates(mode?: number): OperateModel[] {
    return [personJoins, targetOperates.NewCompany];
  }
}
