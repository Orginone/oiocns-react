import { schema } from '../../../base';
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
  get cacheFlag(): string {
    return 'propertys';
  }
  get groupTags(): string[] {
    return [this.metadata.valueType, ...super.groupTags];
  }
  override async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.propertyColl);
    }
    return false;
  }
  override async move(destination: IDirectory): Promise<boolean> {
    if (this.allowMove(destination)) {
      return await super.moveTo(destination.id, destination.resource.propertyColl);
    }
    return false;
  }
}
