import React from 'react';
import { Badge, Button, Divider, Dropdown, MenuProps, Space, Typography } from 'antd';
import cls from './index.module.less';
import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';
import { ImUndo2 } from 'react-icons/im';
import { RiMore2Fill } from 'react-icons/ri';

interface IProps {
  select: string;
  initTags: string[];
  excludeTags: string[];
  extraTags: boolean;
  showBack?: boolean;
  menus: MenuProps;
  selectFiles: IEntity<schema.XEntity>[];
  badgeCount?: (tag: string) => number;
  entitys: IEntity<schema.XEntity>[];
  onChanged: (tag: string) => void;
  onBack: () => void;
}
/** 标签条 */
const TagsBar: React.FC<IProps> = (props) => {
  const items = props.menus.items || [];
  const outside = items.filter((item: any) => item.model === 'outside');
  const inside = items.filter((item: any) => item.model != 'outside');
  // 获取分组标签集
  const groupTags = () => {
    const tags = props.initTags.map((tag) => {
      return { tag, count: 0 };
    });
    if (props.selectFiles.length > 0) {
      tags.push({ tag: '已选中', count: props.selectFiles.length });
    }
    if (props.extraTags) {
      props.entitys.forEach((entity) => {
        entity.groupTags.forEach((tag) => {
          if (!props.excludeTags.includes(tag)) {
            const index = tags.findIndex((i) => i.tag === tag);
            if (index > -1) {
              tags[index].count += 1;
            } else {
              tags.push({ tag, count: 1 });
            }
          }
        });
      });
    }
    return tags.sort((a, b) => {
      const aqz = a.tag === '已删除' ? 10 : 0;
      const bqz = b.tag === '已删除' ? 10 : 0;
      return aqz - bqz;
    });
  };
  const loadBarItem = (tag: string, count: number) => {
    const className = tag === props.select ? cls.tags_item_active : cls.tags_item;
    if (props.badgeCount) {
      const badge = props.badgeCount(tag);
      if (badge > 0) {
        return (
          <div key={tag} className={className} onClick={() => props.onChanged(tag)}>
            <Badge key={tag + '_bdg'} count={badge} size="small" offset={[16, 0]}>
              {tag}
              {count > 0 && <span className={cls.item_count}>{count}</span>}
            </Badge>
          </div>
        );
      }
    }
    return (
      <div key={tag} className={className} onClick={() => props.onChanged(tag)}>
        {tag}
        {count > 0 && <span className={cls.item_count}>{count}</span>}
      </div>
    );
  };
  return (
    <div className={cls.tags}>
      <div className={cls.tags_bar}>
        {props.showBack && (
          <Button type="link" title="返回" icon={<ImUndo2 />} onClick={props.onBack} />
        )}
        <Space split={<Divider type="vertical" style={{ height: 20 }} />} size={0}>
          {groupTags().map((item) => loadBarItem(item.tag, item.count))}
        </Space>
      </div>
      <Space split={<Divider type="vertical" />} size={0}>
        {outside.length > 0 &&
          outside.map((item: any) => {
            return (
              <Typography.Link
                key={item.key}
                title={item.label}
                style={{ fontSize: 18 }}
                onClick={() => {
                  props.menus.onClick?.apply(this, [item]);
                }}>
                {item.icon}
              </Typography.Link>
            );
          })}
        {inside.length > 0 && (
          <Dropdown
            menu={{
              items: inside,
              onClick: props.menus.onClick,
            }}
            dropdownRender={(menu) => (
              <div>{menu && <Button type="link">{menu}</Button>}</div>
            )}
            placement="bottom"
            trigger={['click', 'contextMenu']}>
            <RiMore2Fill fontSize={22} style={{ cursor: 'pointer' }} />
          </Dropdown>
        )}
      </Space>
    </div>
  );
};
export default TagsBar;
