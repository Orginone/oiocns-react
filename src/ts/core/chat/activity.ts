import { model, schema } from '../../base';
import { Entity, IEntity, MessageType } from '../public';
import { XCollection } from '../public/collection';
import { ISession } from './session';
import { CommentType } from '@/ts/base/model';
/** 动态接口类 */
export interface IActivity extends IEntity<schema.XTarget> {
  /** 会话对象 */
  session: ISession;
  /** 是否允许发布 */
  allPublish: boolean;
  /** 动态数据 */
  activityList: model.ActivityType[];
  /** 发布动态 */
  send(
    content: string,
    resources: model.FileItemShare[],
    tags: string[],
  ): Promise<boolean>;
  /** 点赞 */
  like(data: model.ActivityType): Promise<boolean>;

  /** 评论 */
  comment(data: model.ActivityType, txt: string): Promise<boolean>;
  /** 加载动态 */
  load(take: number, beforeTime?: string): Promise<model.ActivityType[]>;
}

/** 动态实现 */
export class Activity extends Entity<schema.XTarget> implements IActivity {
  session: ISession;
  activityList: model.ActivityType[];
  coll: XCollection<model.ActivityType>;
  constructor(_metadata: schema.XTarget, session: ISession) {
    super(_metadata);
    this.session = session;
    this.activityList = [];
    if (this.session.target.id === this.session.sessionId) {
      this.coll = session.target.resource.genColl('resource-activity');
    } else {
      this.coll = new XCollection<model.ActivityType>(_metadata, 'resource-activity', [
        _metadata.id,
      ]);
    }
    this.subscribeNotify();
  }
  get allPublish(): boolean {
    return (
      this.session.target.id === this.session.sessionId &&
      this.session.target.hasRelationAuth()
    );
  }
  async load(take: number, beforeTime?: string): Promise<model.ActivityType[]> {
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
    this.activityList.push(...data);
    return data;
  }
  async like(data: model.ActivityType): Promise<boolean> {
    var newData: model.ActivityType | undefined;
    if (data.likes.find((i) => i === this.userId)) {
      newData = await this.coll.update(data.id, {
        _pull_: { likes: this.userId },
      });
    } else {
      newData = await this.coll.update(data.id, {
        _push_: { likes: this.userId },
      });
    }
    if (newData) {
      return await this.coll.notity({
        data: newData,
        update: true,
      });
    }
    return false;
  }
  async comment(data: model.ActivityType, label: string): Promise<boolean> {
    const newData = await this.coll.update(data.id, {
      _push_: {
        comments: {
          label,
          userId: this.userId,
          time: 'sysdate()',
          comments: [],
        } as CommentType,
      },
    });
    if (newData) {
      return await this.coll.notity({
        data: newData,
        update: true,
      });
    }
    return false;
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
    this.coll.subscribe((res: { update: boolean; data: model.ActivityType }) => {
      if (res.update) {
        const index = this.activityList.findIndex((i) => i.id === res.data.id);
        if (index > -1) {
          this.activityList[index] = res.data;
          this.changCallback();
        }
      } else {
        this.activityList = [res.data, ...this.activityList];
        this.changCallback();
      }
    });
  }
}
