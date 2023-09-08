import { schema, model } from '../../../base';
import { IDirectory } from '../directory';
import { FileInfo, IFileInfo } from '../fileinfo';
export interface IProperty extends IFileInfo<schema.XProperty> {
  /** 表单特性 */
  attributes: schema.XAttribute[];
  /** 更新表单 */
  update(data: model.PropertyModel): Promise<boolean>;
  /** 删除表单 */
  delete(): Promise<boolean>;
}

export class Property extends FileInfo<schema.XProperty> implements IProperty {
  constructor(_metadata: schema.XProperty, _directory: IDirectory) {
    super({ ..._metadata, typeName: '属性' }, _directory);
  }
  attributes: schema.XAttribute[] = [];
  async rename(name: string): Promise<boolean> {
    return await this.update({ ...this.metadata, name: name });
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.target.belongId !== this.directory.target.belongId
    ) {
      const property = await destination.resource.propertyColl.copy(this.metadata);
      if (property) {
        destination.propertys.push(new Property(property, destination));
        return true;
      }
    }
    return false;
  }
  async move(destination: IDirectory): Promise<boolean> {
    if (
      destination.id != this.directory.id &&
      destination.target.belongId === this.directory.target.belongId
    ) {
      const data = {
        ...this.metadata,
        directoryId: destination.id,
      };
      const property = await destination.resource.propertyColl.replace(data);
      if (property) {
        this.setMetadata(data);
        if (this.directory.target.id != destination.target.id) {
          await this.directory.resource.propertyColl.all(true);
          await destination.resource.propertyColl.all(true);
        }
        this.directory.propertys = this.directory.propertys.filter(
          (i) => i.key != this.key,
        );
        this.directory = destination;
        destination.propertys.push(this);
        return true;
      }
    }
    return false;
  }
  async update(data: schema.XProperty): Promise<boolean> {
    const res = await this.directory.resource.propertyColl.replace({
      ...this.metadata,
      ...data,
      directoryId: this.metadata.directoryId,
    });
    if (res) {
      res.typeName = '属性';
      this.setMetadata(res);
      return true;
    }
    return false;
  }
  async delete(): Promise<boolean> {
    if (this.directory) {
      const res = await this.directory.resource.propertyColl.delete(this.metadata);
      if (res) {
        this.directory.propertys = this.directory.propertys.filter(
          (i) => i.key != this.key,
        );
      }
      return res;
    }
    return false;
  }
}
