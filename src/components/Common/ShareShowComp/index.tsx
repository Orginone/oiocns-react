import { AiOutlineCloseCircle } from 'react-icons/ai';
import React from 'react';
import cls from './index.module.less';
import { Typography } from 'antd';
type ShareShowRecentProps = {
  departData: { name: string; id: string; type?: string }[];
  deleteFuc: (id: string) => void;
  onClick?: Function;
};
const ShareShowRecent: React.FC<ShareShowRecentProps> = (props) => {
  const data = props.departData || [];
  return (
    <div className={cls.layout}>
      <div className={cls.title}>已选{data.length}条数据</div>
      <div className={cls.content}>
        {data.map((el: any) => {
          return (
            <div
              style={{
                background:
                  el?.type == 'del' ? '#ffb4c4' : el?.type == 'add' ? '#beffd0' : '',
              }}
              key={el.id}
              className={cls.row}>
              <div
                style={{ width: '80%' }}
                onClick={() => {
                  props.onClick?.call(this, el);
                }}>
                <Typography.Text
                  style={{ fontSize: 12, color: '#888' }}
                  title={el.name}
                  ellipsis>
                  {props.onClick ? <a>{el.name}</a> : el.name}
                </Typography.Text>
              </div>
              <AiOutlineCloseCircle
                style={{ width: '20%' }}
                className={cls.closeIcon}
                onClick={() => {
                  props?.deleteFuc.apply(this, [el.id]);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShareShowRecent;
