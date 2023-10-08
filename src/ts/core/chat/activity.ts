import { Emitter, generateUuid } from '@/ts/base/common';
import { model, schema } from '../../base';
import { Entity, IEntity, MessageType } from '../public';
import { XCollection } from '../public/collection';
import { IPerson } from '../target/person';
import { ISession } from './session';
import { CommentType } from '@/ts/base/model';

/** 动态消息接口 */
export interface IActivityMessage extends Emitter {
  /** 唯一标识 */
  key: string;
  /** 消息主体 */
  activity: IActivity;
  /** 消息实体 */
  metadata: model.ActivityType;
  /** 是否可以删除 */
  canDelete: boolean;
  /** 创建时间 */
  createTime: number;
  /** 更新元数据 */
  update(data: model.ActivityType): void;
  /** 删除消息 */
  delete(): Promise<void>;
  /** 点赞 */
  like(): Promise<boolean>;
  /** 评论 */
  comment(txt: string, replyTo?: string): Promise<boolean>;
}

/** 动态消息实现 */
class ActivityMessage extends Emitter implements IActivityMessage {
  key: string;
  activity: IActivity;
  metadata: model.ActivityType;
  constructor(_metadata: model.ActivityType, _activity: IActivity) {
    super();
    this.key = generateUuid();
    this.activity = _activity;
    this.metadata = _metadata;
  }
  get createTime(): number {
    return new Date(this.metadata.createTime).getTime();
  }
  get canDelete(): boolean {
    return (
      this.metadata.createUser === this.activity.userId ||
      (this.activity.session.sessionId === this.activity.session.target.id &&
        this.activity.session.target.hasRelationAuth())
    );
  }
  update(data: model.ActivityType): void {
    if (data.id === this.metadata.id) {
      this.metadata = data;
      this.changCallback();
    }
  }
  async delete(): Promise<void> {
    if (this.canDelete && (await this.activity.coll.delete(this.metadata))) {
      await this.activity.coll.notity({
        data: this.metadata,
        operate: 'delete',
      });
    }
  }
  async like(): Promise<boolean> {
    var newData: model.ActivityType | undefined;
    if (this.metadata.likes.find((i) => i === this.activity.userId)) {
      newData = await this.activity.coll.update(this.metadata.id, {
        _pull_: { likes: this.activity.userId },
      });
    } else {
      newData = await this.activity.coll.update(this.metadata.id, {
        _push_: { likes: this.activity.userId },
      });
    }
    if (newData) {
      return await this.activity.coll.notity({
        data: newData,
        operate: 'update',
      });
    }
    return false;
  }
  async comment(label: string, replyTo?: string): Promise<boolean> {
    const newData = await this.activity.coll.update(this.metadata.id, {
      _push_: {
        comments: {
          label,
          userId: this.activity.userId,
          time: 'sysdate()',
          replyTo,
        } as CommentType,
      },
    });
    if (newData) {
      return await this.activity.coll.notity({
        data: newData,
        operate: 'update',
      });
    }
    return false;
  }
}

/** 动态接口类 */
export interface IActivity extends IEntity<schema.XTarget> {
  /** 会话对象 */
  session: ISession;
  /** 是否允许发布 */
  allPublish: boolean;
  /** 相关动态接口 */
  activitys: IActivity[];
  /** 动态数据 */
  activityList: IActivityMessage[];
  /** 动态集合 */
  coll: XCollection<model.ActivityType>;
  /** 发布动态 */
  send(
    content: string,
    typeName: MessageType,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean>;
  /** 加载动态 */
  load(take?: number): Promise<IActivityMessage[]>;
}

/** 动态实现 */
export class Activity extends Entity<schema.XTarget> implements IActivity {
  session: ISession;
  activityList: IActivityMessage[];
  coll: XCollection<model.ActivityType>;
  private finished: boolean = false;
  constructor(_metadata: schema.XTarget, session: ISession) {
    super(_metadata, ['动态']);
    this.session = session;
    this.activityList = [];
    if (this.session.target.id === this.session.sessionId) {
      this.coll = session.target.resource.genColl('resource-activity');
    } else {
      this.coll = new XCollection<model.ActivityType>(
        _metadata,
        'resource-activity',
        [_metadata.id],
        [this.key],
      );
    }
    this.subscribeNotify();
  }
  get allPublish(): boolean {
    return (
      this.session.target.id === this.session.sessionId &&
      this.session.target.hasRelationAuth()
    );
  }
  get activitys(): IActivity[] {
    return [this];
  }
  async load(take: number = 10): Promise<IActivityMessage[]> {
    if (!this.finished) {
      const data = await this.coll.load({
        skip: this.activityList.length,
        take: take,
        options: {
          match: {
            isDeleted: false,
          },
          sort: {
            createTime: -1,
          },
        },
      });
      const messages = data.map((i) => new ActivityMessage(i, this));
      this.finished = messages.length < take;
      this.activityList.push(...messages);
      return messages;
    }
    return [];
  }

  async send(
    content: string,
    typeName: MessageType,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean> {
    if (this.allPublish) {
      const data = await this.coll.insert({
        tags: tags,
        comments: [],
        content: content,
        resource: resources,
        typeName: typeName,
        likes: [],
        forward: [],
      } as unknown as model.ActivityType);
      if (data) {
        await this.coll.notity({
          data,
          operate: 'insert',
        });
      }
      return data != undefined;
    }
    return false;
  }

  subscribeNotify() {
    this.coll.subscribe(
      [this.key],
      (res: { operate: string; data: model.ActivityType }) => {
        switch (res.operate) {
          case 'insert':
            this.activityList = [
              new ActivityMessage(res.data, this),
              ...this.activityList,
            ];
            this.changCallback();
            break;
          case 'update':
            {
              const index = this.activityList.findIndex(
                (i) => i.metadata.id === res.data.id,
              );
              if (index > -1) {
                this.activityList[index].update(res.data);
              }
            }
            break;
          case 'delete':
            this.activityList = this.activityList.filter(
              (i) => i.metadata.id !== res.data.id,
            );
            this.changCallback();
            break;
        }
      },
    );
  }
}

export class GroupActivity extends Entity<schema.XTarget> implements IActivity {
  session: ISession;
  allPublish: boolean;
  private subscribeIds: string[] = [];
  private subActivitys: IActivity[];
  lastTime: number = new Date().getTime();
  constructor(_user: IPerson, _activitys: IActivity[], userPublish: boolean) {
    super(
      {
        ..._user.metadata,
        name: '全部',
        typeName: '动态',
        icon: '',
        id: _user.id + 'xxx',
      },
      ['全部动态'],
    );
    this.allPublish = userPublish;
    this.session = _user.session;
    this.subActivitys = _activitys;
  }
  get activitys(): IActivity[] {
    return [this, ...this.subActivitys];
  }
  get coll(): XCollection<model.ActivityType> {
    return this.session.activity.coll;
  }
  get activityList(): IActivityMessage[] {
    const more: IActivityMessage[] = [];
    for (const activity of this.subActivitys) {
      more.push(...activity.activityList.filter((i) => i.createTime >= this.lastTime));
    }
    return more.sort((a, b) => b.createTime - a.createTime);
  }
  async load(take: number = 10): Promise<IActivityMessage[]> {
    await Promise.all(this.subActivitys.map((i) => i.load(take)));
    const more: IActivityMessage[] = [];
    for (const activity of this.subActivitys) {
      more.push(...activity.activityList.filter((i) => i.createTime < this.lastTime));
    }
    const news = more.sort((a, b) => b.createTime - a.createTime).slice(0, take);
    if (news.length > 0) {
      this.lastTime = news[news.length - 1].createTime;
    }
    return news;
  }
  send(
    content: string,
    typeName: MessageType,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean> {
    return this.session.activity.send(content, typeName, resources, tags);
  }
  override subscribe(callback: (key: string, ...args: any[]) => void): string {
    this.subActivitys.forEach((activity) => {
      this.subscribeIds.push(activity.subscribe(callback, false));
    });
    return super.subscribe(callback);
  }
  public unsubscribe(id: string | string[]): void {
    super.unsubscribe(id);
    super.unsubscribe(this.subscribeIds);
  }
}
