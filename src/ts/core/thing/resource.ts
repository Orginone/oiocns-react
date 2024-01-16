import { XCollection } from '../public/collection';
import {
  XApplication,
  XDirectory,
  XForm,
  XProperty,
  XSpecies,
  XSpeciesItem,
  XTarget,
  Xbase,
  XPageTemplate,
  XStaging,
  XThing,
} from '../../base/schema';
import { BucketOpreates, ChatMessageType, Transfer } from '@/ts/base/model';
import { kernel, model } from '@/ts/base';
import { blobToDataUrl, encodeKey, generateUuid, sliceFile } from '@/ts/base/common';

/** 数据核资源（前端开发） */
export class DataResource {
  private _keys: string[];
  private target: XTarget;
  private relations: string[];
  private _proLoaded: boolean = false;
  constructor(target: XTarget, relations: string[], keys: string[]) {
    this._keys = keys;
    this.target = target;
    this.relations = relations;
    this.formColl = this.genTargetColl<XForm>('standard-form');
    this.transferColl = this.genTargetColl<Transfer>('standard-transfer');
    this.speciesColl = this.genTargetColl<XSpecies>('standard-species');
    this.messageColl = this.genTargetColl<ChatMessageType>('chat-messages');
    this.propertyColl = this.genTargetColl<XProperty>('standard-property');
    this.directoryColl = this.genTargetColl<XDirectory>('resource-directory');
    this.fileDirectoryColl = this.genTargetColl<XDirectory>('resource-directory-temp');
    this.applicationColl = this.genTargetColl<XApplication>('standard-application');
    this.speciesItemColl = this.genTargetColl<XSpeciesItem>('standard-species-item');
    this.templateColl = this.genTargetColl<XPageTemplate>('standard-page-template');
    this.stagingColl = this.genTargetColl<XStaging>('resource-staging');
    this.thingColl = this.genTargetColl<XThing>('_system-things');
  }

  /** 表单集合 */
  formColl: XCollection<XForm>;
  /** 属性集合 */
  propertyColl: XCollection<XProperty>;
  /** 分类集合 */
  speciesColl: XCollection<XSpecies>;
  /** 类目集合 */
  speciesItemColl: XCollection<XSpeciesItem>;
  /** 应用集合 */
  applicationColl: XCollection<XApplication>;
  /** 资源目录集合 */
  directoryColl: XCollection<XDirectory>;
  /** 迁移附件目录集合 */
  fileDirectoryColl: XCollection<XDirectory>;
  /** 群消息集合 */
  messageColl: XCollection<ChatMessageType>;
  /** 数据传输配置集合 */
  transferColl: XCollection<Transfer>;
  /** 页面模板集合 */
  templateColl: XCollection<XPageTemplate>;
  /** 暂存集合 */
  stagingColl: XCollection<XStaging>;
  /** 实体集合 */
  thingColl: XCollection<XThing>;
  /** 资源对应的用户信息 */
  get targetMetadata() {
    return this.target;
  }
  /** 资源预加载 */
  async preLoad(reload: boolean = false): Promise<void> {
    if (this._proLoaded === false || reload) {
      await Promise.all([
        this.directoryColl.all(reload),
        this.applicationColl.all(reload),
        this.templateColl.all(reload),
      ]);
    }
    this._proLoaded = true;
  }
  /** 生成集合 */
  genColl<T extends Xbase>(collName: string, relations?: string[]): XCollection<T> {
    return new XCollection<T>(
      this.target,
      collName,
      relations || this.relations,
      this._keys,
    );
  }
  /** 生成用户类型的集合 */
  genTargetColl<T extends Xbase>(collName: string): XCollection<T> {
    return new XCollection<T>(this.target, collName, this.relations, this._keys);
  }
  /** 文件桶操作 */
  async bucketOpreate<R>(data: model.BucketOpreateModel): Promise<model.ResultType<R>> {
    return await kernel.bucketOpreate<R>(this.target.belongId, this.relations, data);
  }
  /** 删除文件目录 */
  async deleteDirectory(directoryId: string): Promise<void> {
    await this.bucketOpreate({
      key: encodeKey(directoryId),
      operate: BucketOpreates.Delete,
    });
  }
  /** 上传文件 */
  public async fileUpdate(
    file: Blob,
    key: string,
    progress: (p: number) => void,
  ): Promise<model.FileItemModel | undefined> {
    const id = generateUuid();
    const data: model.BucketOpreateModel = {
      key: encodeKey(key),
      operate: model.BucketOpreates.Upload,
    };
    progress.apply(this, [0]);
    const slices = sliceFile(file, 1024 * 1024);
    for (let i = 0; i < slices.length; i++) {
      const s = slices[i];
      data.fileItem = {
        index: i,
        uploadId: id,
        size: file.size,
        data: [],
        dataUrl: await blobToDataUrl(s),
      };
      const res = await this.bucketOpreate<model.FileItemModel>(data);
      if (!res.success) {
        data.operate = model.BucketOpreates.AbortUpload;
        await this.bucketOpreate<boolean>(data);
        progress.apply(this, [-1]);
        return;
      }
      const finished = i * 1024 * 1024 + s.size;
      progress.apply(this, [finished]);
      if (finished === file.size && res.data) {
        return res.data;
      }
    }
  }
}
