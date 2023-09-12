import { schema } from '../../../base';
import { XCollection } from '../../public/collection';
import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';
export interface IProperty extends IStandardFileInfo<schema.XProperty> {
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 删除表单 */
  delete(): Promise<boolean>;
}

export class Property extends StandardFileInfo<schema.XProperty> implements IProperty {
  constructor(_metadata: schema.XProperty, _directory: IDirectory) {
    super(
      { ..._metadata, typeName: '属性' },
      _directory,
      _directory.resource.propertyColl,
    );
  }
  attributes: schema.XAttribute[] = [];
  override copy(
    destination: IDirectory,
    _coll?: XCollection<schema.XProperty>,
  ): Promise<boolean> {
    return super.copy(destination, destination.resource.propertyColl);
  }
}
