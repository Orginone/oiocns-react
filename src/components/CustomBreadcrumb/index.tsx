import { AiOutlineCaretRight } from 'react-icons/ai';
import { Breadcrumb, Divider, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuItemType } from 'typings/globelType';

interface CustomBreadcrumbType {
  leftBar?: React.ReactNode;
  selectKey: string;
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
}
const CustomBreadcrumb = (props: CustomBreadcrumbType) => {
  const [items, setItems] = useState<MenuItemType[]>([]);
  useEffect(() => {
    setItems(loadBreadItems([props.item], props.selectKey));
  }, [props.selectKey]);

  const loadBreadItems = (items: MenuItemType[], key: string) => {
    const result: MenuItemType[] = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.key === key) {
          result.push(item);
        } else {
          const nodes = loadBreadItems(item.children, key);
          if (nodes.length > 0) {
            result.push(...nodes);
            result.unshift(item);
          }
        }
      }
    }
    return result;
  };

  const loadItemMenus = (item: MenuItemType) => {
    if (item.children && item.children.length > 0) {
      return {
        items: item.children.map((i) => {
          return {
            key: i.key,
            icon: <span style={{ fontSize: 16, paddingTop: 2 }}>{i.icon}</span>,
            label: i.label,
          };
        }),
        onClick: (info: { key: string }) => {
          for (const i of item.children) {
            if (i.key === info.key) {
              props.onSelect?.apply(this, [i]);
            }
          }
        },
      };
    }
    return undefined;
  };

  return (
    <Space wrap split={<Divider type="vertical" />} size={2}>
      {props.leftBar && props.leftBar}
      <Breadcrumb separator={<AiOutlineCaretRight />} className="customBreadcrumb">
        {items.map((item) => {
          return (
            <Breadcrumb.Item
              menu={loadItemMenus(item)}
              key={item.key}
              onClick={() => {
                props.onSelect?.apply(this, [item]);
              }}>
              <span style={{ fontSize: 16, paddingTop: 6, paddingRight: 4 }}>
                {item.icon}
              </span>
              {item.label}{' '}
              {item.tag &&
                item.tag.map((tag) => {
                  return (
                    <Tag key={tag} color="success">
                      {tag}
                    </Tag>
                  );
                })}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Space>
  );
};

export default CustomBreadcrumb;
