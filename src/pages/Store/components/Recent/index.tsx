import IProduct from '@/ts/core/market/iproduct';
import {
  EllipsisOutlined,
  SendOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { Dropdown, MenuProps, message, Typography } from 'antd';
import React from 'react';

import cls from './index.module.less';
interface Props {
  dataSource: IProduct[];
}
const imgSrc =
  'https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg';
const moreMenu: MenuProps = {
  onClick: (info) => {
    message.info(info.key);
  },
  items: [
    {
      label: '打开',
      key: 'open',
      icon: <SendOutlined />,
    },
    {
      label: '详情',
      key: 'info',
      icon: <UnorderedListOutlined />,
    },
    {
      label: '管理',
      key: 'manage',
      icon: <SettingOutlined />,
    },
  ],
};

const StoreRecent: React.FC<Props> = ({ dataSource }) => {
  return (
    <div className={''}>
      {dataSource.map((item) => {
        return (
          <CheckCard
            className={cls.buyCard}
            key={item.prod.id}
            avatar={imgSrc}
            title={item.prod.name}
            description={
              <Typography.Paragraph
                type="secondary"
                className={cls.decription}
                ellipsis={{ rows: 3 }}>
                {item.prod.remark}
              </Typography.Paragraph>
            }
            extra={
              <Dropdown placement="bottomLeft" menu={moreMenu}>
                <EllipsisOutlined
                  style={{ fontSize: 22, color: 'rgba(0,0,0,0.5)' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            }></CheckCard>
        );
      })}
    </div>
  );
};

export default React.memo(StoreRecent);
