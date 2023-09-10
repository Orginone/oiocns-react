import { Collection } from '../public/collection';
import {
  XApplication,
  XDirectory,
  XForm,
  XProperty,
  XSpecies,
  XSpeciesItem,
  XTarget,
  Xbase,
} from '../../base/schema';
import { ActivityType, ChatMessageType } from '@/ts/base/model';
import { kernel, model } from '@/ts/base';
import { blobToDataUrl, encodeKey, generateUuid, sliceFile } from '@/ts/base/common';

/** 数据核资源（前端开发） */
export class DataResource {
  private target: XTarget;
  private relations: string[];
  private _proLoaded: boolean = false;
  constructor(target: XTarget, relations: string[]) {
    this.target = target;
    this.relations = relations;
    this.formColl = this.genColl<XForm>('standard-form');
    this.speciesColl = this.genColl<XSpecies>('standard-species');
    this.messageColl = this.genColl<ChatMessageType>('chat-messages');
    this.activityColl = this.genColl<ActivityType>('-resource-activity');
    this.propertyColl = this.genColl<XProperty>('standard-property');
    this.directoryColl = this.genColl<XDirectory>('resource-directory');
    this.applicationColl = this.genColl<XApplication>('standard-application');
    this.speciesItemColl = this.genColl<XSpeciesItem>('standard-species-item');
  }
  /** 表单集合 */
  formColl: Collection<XForm>;
  /** 属性集合 */
  propertyColl: Collection<XProperty>;
  /** 分类集合 */
  speciesColl: Collection<XSpecies>;
  /** 类目集合 */
  speciesItemColl: Collection<XSpeciesItem>;
  /** 应用集合 */
  applicationColl: Collection<XApplication>;
  /** 资源目录集合 */
  directoryColl: Collection<XDirectory>;
  /** 动态集合 */
  activityColl: Collection<ActivityType>;
  /** 群消息集合 */
  messageColl: Collection<ChatMessageType>;
  /** 资源预加载 */
  async preLoad(): Promise<void> {
    if (this._proLoaded === false) {
      await Promise.all([
        this.formColl.all(),
        this.speciesColl.all(),
        this.propertyColl.all(),
        this.directoryColl.all(),
        this.applicationColl.all(),
      ]);
    }
    this._proLoaded = true;
  }
  /** 生成类型的集合 */
  genColl<T extends Xbase>(collName: string): Collection<T> {
    return new Collection<T>(this.target, collName, this.relations);
  }
  /** 文件桶操作 */
  async bucketOpreate<R>(data: model.BucketOpreateModel): Promise<model.ResultType<R>> {
    return await kernel.bucketOpreate<R>(this.target.belongId, this.relations, data);
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
