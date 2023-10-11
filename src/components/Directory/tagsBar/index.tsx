import React from 'react';
import { Badge, Divider, Space } from 'antd';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';

interface IProps {
  select: string;
  initTags: string[];
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[];
  onChanged: (tag: string) => void;
}
/** 标签条 */
const TagsBar: React.FC<IProps> = (props) => {
  // 获取分组标签集
  const groupTags = () => {
    const tags = props.initTags.map((tag) => {
      return { tag, count: 0 };
    });
    if (props.selectFiles.length > 0) {
      tags.push({ tag: '已选中', count: props.selectFiles.length });
    }
    props.entitys.forEach((entity) => {
      entity.groupTags.forEach((tag) => {
        const index = tags.findIndex((i) => i.tag === tag);
        if (index > -1) {
          tags[index].count += 1;
        } else {
          tags.push({ tag, count: 1 });
        }
      });
    });
    return tags.sort((a, b) => {
      const aqz = a.tag === '已删除' ? 10 : 0;
      const bqz = b.tag === '已删除' ? 10 : 0;
      return aqz - bqz;
    });
  };
  const loadBarItem = (tag: string, count: number) => {
    const className = tag === props.select ? cls.tags_item_active : cls.tags_item;
    const barItem = (
      <div key={tag} className={className} onClick={() => props.onChanged(tag)}>
        {tag}
        {count > 0 && <span className={cls.item_count}>{count}</span>}
      </div>
    );
    if (props.badgeCount) {
      const badge = props.badgeCount(tag);
      if (badge > 0) {
        return (
          <Badge key={tag + '_bdg'} count={badge} size="small" offset={[-7, 7]}>
            {barItem}
          </Badge>
        );
      }
    }
    return barItem;
  };
  return (
    <div className={cls.tags_bar}>
      <Space split={<Divider type="vertical" style={{ height: 20 }} />} size={2}>
        {groupTags().map((item) => loadBarItem(item.tag, item.count))}
      </Space>
    </div>
  );
};
export default TagsBar;
