import { Typography } from 'antd';
import React from 'react';
import cls from './index.module.less';

const BasicTitle: React.FC<{
  title: string;
  more?: string;
  onClick?: Function;
}> = (props) => {
  return (
    <div className={cls.basicTitle}>
      <Typography.Title level={4}>{props.title}</Typography.Title>
      {props.more && (
        <Typography.Link onClick={() => props.onClick?.apply(this, [])}>
          更多
        </Typography.Link>
      )}
    </div>
  );
};
export default BasicTitle;
