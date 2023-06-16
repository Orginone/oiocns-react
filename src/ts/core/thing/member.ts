import { OperateModel } from '@/ts/base/model';
import { schema } from '../../base';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';

/** 应用/模块接口类 */
export interface IMemeber extends IFileInfo<schema.XTarget> {
  isMember: boolean;
}

/** 应用实现类 */
export class Member extends FileInfo<schema.XTarget> implements IMemeber {
  constructor(_metadata: schema.XTarget, _directory: IDirectory) {
    super(_metadata, _directory);
  }
  isMember: boolean = true;
  async rename(name: string): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async copy(destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async move(destination: IDirectory): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  async delete(): Promise<boolean> {
    throw new Error('暂不支持.');
  }
  override operates(): OperateModel[] {
    const operates = super.operates();
    if (
      this.metadata.id != this.directory.target.userId &&
      this.directory.target.hasRelationAuth()
    ) {
      operates.unshift({
        cmd: 'remove',
        label: '移除成员',
        iconType: 'remove',
      });
    }
    return operates;
  }
}
