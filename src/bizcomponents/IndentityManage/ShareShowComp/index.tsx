import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';
import cls from './index.module.less';
type ShareShowRecentProps = {
  departData: any[];
  deleteFuc: (id: string) => void;
};
const ShareShowRecent: React.FC<ShareShowRecentProps> = (props) => {
  return (
    <div className={cls.layout}>
      <div className={cls.title}>已选{props.departData.length}条数据</div>
      <div className={cls.content}>
        {props.departData.map((el: any) => {
          return (
            <div
              style={{
                background:
                  el.type == 'del' ? '#ffb4c4' : el.type == 'add' ? '#beffd0' : '',
              }}
              key={el.id}
              className={cls.row}>
              <div>{el.name}</div>
              <CloseCircleOutlined
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
