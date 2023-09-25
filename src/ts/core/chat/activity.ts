import { Emitter } from '@/ts/base/common';
import { model, schema } from '../../base';
import { Entity, IEntity, MessageType } from '../public';
import { XCollection } from '../public/collection';
import { IPerson } from '../target/person';
import { ISession } from './session';
import { CommentType } from '@/ts/base/model';

/** 动态消息接口 */
export interface IActivityMessage extends Emitter {
  /** 消息主体 */
  activity: IActivity;
  /** 消息实体 */
  metadata: model.ActivityType;
  /** 更新元数据 */
  update(data: model.ActivityType): void;
  /** 删除消息 */
  delete(): void;
  /** 点赞 */
  like(): Promise<boolean>;
  /** 评论 */
  comment(txt: string, replyTo?: string): Promise<boolean>;
}

/** 动态消息实现 */
class ActivityMessage extends Emitter implements IActivityMessage {
  activity: IActivity;
  metadata: model.ActivityType;
  constructor(_metadata: model.ActivityType, _activity: IActivity) {
    super();
    this.activity = _activity;
    this.metadata = _metadata;
  }
  delete(): void {
    this.changCallback();
    this.activity.activityList.filter((i) => i.metadata.id != this.metadata.id);
  }
  update(data: model.ActivityType): void {
    if (data.id === this.metadata.id) {
      this.metadata = data;
      this.changCallback();
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
        update: true,
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
        update: true,
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
  /** 动态数据 */
  activityList: IActivityMessage[];
  /** 动态集合 */
  coll: XCollection<model.ActivityType>;
  /** 发布动态 */
  send(
    content: string,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean>;
  /** 加载动态 */
  load(take: number, beforeTime?: string): Promise<IActivityMessage[]>;
}

/** 动态实现 */
export class Activity extends Entity<schema.XTarget> implements IActivity {
  session: ISession;
  activityList: IActivityMessage[];
  coll: XCollection<model.ActivityType>;
  constructor(_metadata: schema.XTarget, session: ISession) {
    super(_metadata);
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
  async load(take: number, beforeTime?: string): Promise<IActivityMessage[]> {
    const data = await this.coll.load({
      take: take,
      options: {
        match: beforeTime
          ? {
              createTime: {
                _lt_: beforeTime,
              },
            }
          : {},
        sort: {
          createTime: -1,
        },
      },
    });
    const messages = data.map((i) => new ActivityMessage(i, this));
    this.activityList.push(...messages);
    return messages;
  }

  async send(
    content: string,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean> {
    if (this.allPublish) {
      const data = await this.coll.insert({
        tags: tags,
        comments: [],
        content: content,
        resource: resources,
        typeName: MessageType.Text,
        likes: [],
        forward: [],
      } as unknown as model.ActivityType);
      if (data) {
        await this.coll.notity({
          data,
          update: false,
        });
      }
      return data != undefined;
    }
    return false;
  }

  subscribeNotify() {
    this.coll.subscribe(
      [this.key],
      (res: { update: boolean; data: model.ActivityType }) => {
        if (res.update) {
          const index = this.activityList.findIndex((i) => i.metadata.id === res.data.id);
          if (index > -1) {
            this.activityList[index].update(res.data);
          }
        } else {
          this.activityList = [new ActivityMessage(res.data, this), ...this.activityList];
          this.changCallback();
        }
      },
    );
  }
}

export class FriendsActivity extends Entity<schema.XTarget> implements IActivity {
  allPublish: boolean = true;
  user: IPerson;
  constructor(_user: IPerson) {
    super(_user.metadata);
    this.user = _user;
    this.activitys.forEach((activity) => {
      activity.subscribe(() => {
        this.changCallback();
      });
    });
  }
  get coll(): XCollection<model.ActivityType> {
    return this.session.activity.coll;
  }
  get session(): ISession {
    return this.user.session;
  }
  get activityList(): IActivityMessage[] {
    const list: IActivityMessage[] = [];
    this.activitys.forEach((activity) => list.push(...activity.activityList));
    return list.sort((a, b) => {
      return (
        new Date(b.metadata.createTime).getTime() -
        new Date(a.metadata.createTime).getTime()
      );
    });
  }
  get activitys(): IActivity[] {
    return [this.session.activity, ...this.user.memberChats.map((i) => i.activity)];
  }
  async load(take: number, beforeTime?: string | undefined): Promise<IActivityMessage[]> {
    await Promise.all(this.activitys.map((i) => i.load(take, beforeTime)));
    return this.activityList;
  }
  send(
    content: string,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean> {
    return this.session.activity.send(content, resources, tags);
  }
}
