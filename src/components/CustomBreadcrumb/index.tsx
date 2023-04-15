import { CaretRightOutlined } from '@ant-design/icons';
import { Breadcrumb, Divider, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ImArrowLeft2 } from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import css from './index.module.less';

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
      <Typography.Link
        disabled={items.length === 1}
        onClick={() => {
          props.onSelect?.apply(this, [items[items.length - 2]]);
        }}>
        <ImArrowLeft2 fontSize={16} />
      </Typography.Link>
      <Breadcrumb separator={<CaretRightOutlined />} className={css.customBreadcrumb}>
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
              {item.label}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Space>
  );
};

export default CustomBreadcrumb;
