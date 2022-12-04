import { Card, CardProps } from 'antd';
import React from 'react';
import styles from './index.module.less';

const PageCard: React.FC<CardProps> = (props: CardProps) => {
  const { children, className = '', tabList = [], ...otherProps } = props;
  return (
    <Card
      className={className + styles[`card-wrap`]}
      tabList={tabList}
      bordered={false}
      headStyle={{ borderBottom: 0, fontSize: 12 }}
      {...otherProps}>
      {children}
    </Card>
  );
};

export default PageCard;
