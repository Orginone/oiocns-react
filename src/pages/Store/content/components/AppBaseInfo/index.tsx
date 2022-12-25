import cls from './index.module.less';

import React from 'react';
// import { useHistory } from 'react-router-dom';
import appCtrl from '@/ts/controller/store/appCtrl';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
interface indexType {}
const Index: React.FC<indexType> = () => {
  // const history = useHistory();
  const prod = appCtrl.curProduct?.prod || {
    name: '--',
    remark: '--',
    createUser: '--',
    createTime: '--',
  };
  return (
    <>
      <ul className={`${cls['base-info']} flex flex-direction-col`}>
        <li className={`${cls['con']} flex `}>
          <div className={cls['con-title']}>{prod.name}</div>
          <EditOutlined
            className={cls['con-name-edit-btn']}
            style={{ fontSize: '1.5em' }}
          />
        </li>
        <li className={`${cls['con']} flex flex-direction-col`}>
          <span className={cls['con-label']}>应用图标</span>
          <img className={cls['con-img']} src="/img/appLogo.png" alt="" />
        </li>
        <li className={`${cls['con']} flex `}>
          <div className={cls['con-info']}>
            <span className={cls['con-label']}>应用曾用名</span>
            <Tooltip title="prompt text">
              <div className={cls['con-name']}> {prod.name}</div>
            </Tooltip>
          </div>
          <div className={cls['con-info']}>
            <span className={cls['con-label']}>应用描述</span>
            <Tooltip title={''}>
              <div className={cls['con-name']}>{prod.remark}</div>
            </Tooltip>
          </div>
        </li>
        <li className={`${cls['con']} ${cls['endBox']} flex `}>
          <p style={{ marginRight: '14px' }}>
            创建人：<span>{prod.createUser}</span>
          </p>
          <p>
            创建时间：<span>{prod.createTime}</span>
          </p>
        </li>
      </ul>
    </>
  );
};

export default Index;
