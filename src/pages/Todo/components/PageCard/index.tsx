import { Button, Card, CardProps, Space } from 'antd';
import React from 'react';
import styles from './index.module.less';

const PageCard: React.FC<CardProps> = (props: CardProps) => {
  const {
    children,
    className = '',
    tabList = [
      { tab: '待办', key: '1' },
      { tab: '我的发起', key: '2' },
    ],
    // tabBarExtraContent = (
    //   <Space>
    //     <Button key="1" type="primary">
    //       同意
    //     </Button>
    //     <Button key="2">拒绝</Button>
    //     <Button key="3">打印</Button>
    //   </Space>
    // ),
    ...otherProps
  } = props;
  return (
    <Card
      className={className + styles[`card-wrap`]}
      tabList={tabList}
      bordered={false}
      headStyle={{ borderBottom: 0, fontSize: 12 }}
      // tabBarExtraContent={tabBarExtraContent}
      {...otherProps}>
      {children}
    </Card>
  );
};

export default PageCard;
