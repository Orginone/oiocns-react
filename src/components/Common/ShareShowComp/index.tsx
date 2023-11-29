import { AiOutlineCloseCircle } from 'react-icons/ai';
import React from 'react';
import cls from './index.module.less';
type ShareShowRecentProps = {
  departData: any[];
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
                onClick={() => {
                  props.onClick?.call(this, el);
                }}>
                {props.onClick ? <a>{el.name}</a> : el.name}
              </div>
              <AiOutlineCloseCircle
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
