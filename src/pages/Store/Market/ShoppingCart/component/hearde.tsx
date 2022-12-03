import React from 'react';
import cls from '../index.module.less';
import { LeftOutlined } from '@ant-design/icons';
const hearde = (props) => {
  console.log(props);

  return (
    <>
      <div className={cls['head']}>
        <div className={cls['left']}>
          <div
            className={cls['click']}
            onClick={() => {
              props.fatherprops.history.go(-1);
            }}>
            <LeftOutlined />
            返回
          </div>
          <div className={cls['gang']}>|</div>
          <div className={cls['title']}>{props.fatherprops.route.title}</div>
        </div>
        <div className={cls['right']}>
          <div className={cls['buy']} onClick={props.showConfirms('rm')}>
            删除
          </div>
          <div className={cls['buy']} onClick={props.showConfirms('add')}>
            购买
          </div>
        </div>
      </div>
    </>
  );
};

export default hearde;
