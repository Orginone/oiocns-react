import IProduct from '@/ts/core/market/iproduct';
import { AiOutlineEllipsis, AiOutlineSend, AiOutlineUnderline } from 'react-icons/ai';
import { CheckCard } from '@ant-design/pro-components';
import { Dropdown, MenuProps, Typography } from 'antd';
import React from 'react';
import useClcik from '@/hooks/useClcik';

import cls from './index.module.less';
import { useHistory } from 'react-router-dom';
interface Props {
  dataSource: IProduct[];
}
const imgSrc =
  'https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg';

const StoreRecent: React.FC<Props> = ({ dataSource }) => {
  const history = useHistory();
  const moreMenu: MenuProps = {
    items: [
      {
        label: '打开',
        key: 'open',
        icon: <AiOutlineSend />,
        onClick: () => {
          history.push({
            pathname: '/online',
            state: { appId: appCtrl.curProduct?.prod.id },
          });
        },
      },
      {
        label: '详情',
        key: 'info',
        icon: <AiOutlineUnderline />,
        onClick: () => {
          history.push({ pathname: '/store/app/info' });
        },
      },
      // {
      //   label: '管理',
      //   key: 'manage',
      //   icon: <AiOutlineSetting />,
      // },
    ],
  };
  const onAppClick = useClcik(
    (item: any) => {
      console.log('单击事件触发了', item.name);
    },
    (item: any) => {
      console.log('双击事件触发了', item.name);
      appCtrl.setCurProduct(item);
      history.push({ pathname: '/online', state: { appId: item.id } });
    },
  );
  return (
    <div className={cls.cardContainer}>
      {dataSource.map((item) => {
        return (
          <CheckCard
            className={cls.card}
            key={item.prod.id}
            avatar={imgSrc}
            title={item.prod.name}
            onClick={() => {
              onAppClick(item.prod);
            }}
            description={
              <Typography.Paragraph
                type="secondary"
                className={cls.decription}
                ellipsis={{ rows: 3 }}>
                {item.prod.remark}
              </Typography.Paragraph>
            }
            extra={
              <Dropdown
                placement="bottomLeft"
                menu={moreMenu}
                onOpenChange={() => {
                  appCtrl.setCurProduct(item);
                }}>
                <AiOutlineEllipsis
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
