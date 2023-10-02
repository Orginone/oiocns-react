import React from 'react';
import { Badge, Button, Divider, Space } from 'antd';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';

interface IProps {
  select: string;
  initTags: string[];
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
    return tags;
  };
  const loadBarItem = (tag: string, count: number) => {
    const className = tag === props.select ? cls.tags_item_active : cls.tags_item;
    const barItem = (
      <Button
        key={tag}
        className={className}
        type="text"
        onClick={() => props.onChanged(tag)}>
        {tag}
      </Button>
    );
    if (count > 0) {
      return (
        <Badge
          key={tag + '_bdg'}
          count={count}
          size="small"
          offset={[2, 6]}
          status="success">
          {barItem}
        </Badge>
      );
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
