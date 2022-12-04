import { BaseProduct } from '@/ts/core/market';
import {
  EllipsisOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { Dropdown, MenuProps, message, Typography } from 'antd';
import React from 'react';

import cls from './index.module.less';
interface Props {
  dataSource: BaseProduct[];
}
const imgSrc =
  'https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg';
const moreMenu: MenuProps = {
  onClick: (info) => {
    message.info(info.key);
  },
  items: [
    {
      label: '详情',
      key: '1',
      icon: <UnorderedListOutlined />,
    },
    {
      label: '管理',
      key: '2',
      icon: <SettingOutlined />,
    },
  ],
};

const StoreRecent: React.FC<Props> = ({ dataSource }) => {
  console.log('试试', dataSource);

  return (
    <div className={cls.cardContainer}>
      {dataSource.map((item) => {
        return (
          <CheckCard
            className={cls.card}
            key={item._prod.id}
            avatar={imgSrc}
            title={item._prod.name}
            description={
              <Typography.Paragraph
                type="secondary"
                className={cls.decription}
                ellipsis={{ rows: 3 }}>
                {item._prod.remark}
              </Typography.Paragraph>
            }
            style={{ width: 260, height: 120 }}
            extra={
              <Dropdown placement="bottomRight" menu={moreMenu}>
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
