import { OperateModel } from '@/ts/base/model';
import { schema } from '../../base';
import { IDirectory } from './directory';
import { FileInfo, IFileInfo } from './fileinfo';
import { fileOperates } from '../public';

/** 应用/模块接口类 */
export interface IMemeber extends IFileInfo<schema.XTarget> {}

/** 应用实现类 */
export class Member extends FileInfo<schema.XTarget> implements IMemeber {
  constructor(_metadata: schema.XTarget, _directory: IDirectory) {
    super(_metadata, _directory);
  }
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
    return [
      {
        cmd: 'remove',
        label: '移除成员',
        iconType: 'remove',
      },
      fileOperates.Remark,
    ];
  }
}
