import React from 'react';
import { Badge, Divider, Space } from 'antd';
import cls from './index.module.less';

interface IProps {
  select: string;
  initTags: string[];
  badgeCount?: (tag: string) => number;
  onChanged: (tag: string) => void;
}
/** 标签条 */
const TagsBar: React.FC<IProps> = (props) => {
  // 获取分组标签集
  const groupTags = () => {
    const tags = props.initTags.map((tag) => {
      return { tag, count: 0 };
    });
    return tags;
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
