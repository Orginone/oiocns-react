import { schema } from '../../base';
import { XCollection } from '../public/collection';
import { Directory, IDirectory } from './directory';
import { IStandard, IStandardFileInfo, StandardFileInfo } from './fileinfo';
import { DataResource } from './resource';
import { Application, IApplication } from './standard/application';
import { Form } from './standard/form';
import { Property } from './standard/property';
import { Species } from './standard/species';
import { Transfer } from './standard/transfer';
export interface IDirectoryOperate {
  /** 是否为空 */
  isEmpty: boolean;
  /** 加载资源 */
  loadResource(reload?: boolean, files?: IStandard[]): Promise<void>;
  /** 获取目录内容 */
  getContent<T>(typeNames: string[]): T[];
  /** 接收通知 */
  receiveMessage<T extends schema.XStandard>(
    operate: string,
    data: T,
    coll: XCollection<T>,
    create: (data: T, dir: IDirectory) => IStandardFileInfo<T> | undefined,
  ): Promise<boolean>;
}

export class DirectoryOperate implements IDirectoryOperate {
  directory: IDirectory;
  private resource: DataResource;
  standardFiles: IStandard[] = [];
  constructor(_directory: IDirectory, _resource: DataResource) {
    this.resource = _resource;
    this.directory = _directory;
    if (!_directory.parent) {
      this.subscribe(_resource.formColl, (s, l) => {
        return new Form(s, l);
      });
      this.subscribe(_resource.propertyColl, (s, l) => {
        return new Property(s, l);
      });
      this.subscribe(_resource.speciesColl, (s, l) => {
        return new Species(s, l);
      });
      this.subscribe(_resource.transferColl, (s, l) => {
        return new Transfer(s, l);
      });
      this.subscribe(_resource.applicationColl, (s, l) => {
        if (!(s.parentId && s.parentId.length > 5)) {
          return new Application(s, l);
        }
      });
      this.subscribe(_resource.directoryColl, (s, l) => {
        return new Directory(s, this.directory.target, l);
      });
    }
  }

  getContent<T>(typeNames: string[]): T[] {
    return this.standardFiles.filter((a) => typeNames.includes(a.typeName)) as T[];
  }

  get isEmpty() {
    return this.standardFiles.length == 0;
  }

  async loadResource(reload: boolean = false, files: IStandard[] = []): Promise<void> {
    if (!this.directory.parent || reload) {
      await this.resource.preLoad(reload);
    }
    this.standardFiles = [...files];
    var apps = this.resource.applicationColl.cache.filter(
      (i) => i.directoryId === this.directory.id,
    );
    this.standardFiles.push(
      ...apps
        .filter((a) => !a.parentId || a.parentId.length < 1)
        .map((a) => new Application(a, this.directory, undefined, apps)),
    );
    for (const child of this.resource.directoryColl.cache.filter(
      (i) => i.directoryId === this.directory.id,
    )) {
      const subDir = new Directory(child, this.directory.target, this.directory);
      await subDir.loadDirectoryResource();
      this.standardFiles.push(subDir);
    }
  }

  async receiveMessage<T extends schema.XStandard>(
    operate: string,
    data: T,
    coll: XCollection<T>,
    create: (mData: T, dir: IDirectory) => StandardFileInfo<T> | undefined,
  ): Promise<boolean> {
    if (data.directoryId == this.directory.id) {
      if (data.typeName == '模块') {
        for (const app of this.getContent<IApplication>(['应用'])) {
          if (await app.receiveMessage(operate, data as unknown as schema.XApplication)) {
            return true;
          }
        }
      }
      switch (operate) {
        case 'insert':
          coll.cache.push(data);
          {
            let standard = create(data, this.directory);
            if (standard) {
              this.standardFiles.push(standard);
            }
          }
          break;
        case 'delete':
        case 'replace':
          {
            const index = coll.cache.findIndex((a) => a.id == data.id);
            coll.cache[index] = data;
            this.standardFiles.find((i) => i.id === data.id)?.setMetadata(data);
          }
          break;
        case 'remove':
          await coll.removeCache(data.id);
          this.standardFiles = this.standardFiles.filter((a) => a.id != data.id);
          break;
        case 'refresh':
          this.directory.structCallback();
          return true;
      }
      this.directory.changCallback();
      return true;
    } else {
      for (const child of this.standardFiles) {
        if (
          child.typeName == '目录' &&
          (await (child as unknown as IDirectory).operater.receiveMessage(
            operate,
            data,
            coll,
            create,
          ))
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private subscribe<T extends schema.XStandard>(
    coll: XCollection<T>,
    create: (data: T, dir: IDirectory) => StandardFileInfo<T> | undefined,
  ) {
    coll.subscribe([this.directory.key], (a: { operate: string; data: T[] }) => {
      a?.data?.forEach((s) => {
        this.receiveMessage<T>(a.operate, s, coll, create);
      });
    });
  }
}
