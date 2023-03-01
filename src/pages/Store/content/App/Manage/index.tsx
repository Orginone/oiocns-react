import { Card, Dropdown, Tag } from 'antd';
import React from 'react';
import cls from './index.module.less';
import AppBase from '../../components/AppBaseInfo';
import {
  CheckCircleOutlined,
  EllipsisOutlined,
  SendOutlined,
  TwitterOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { IconFont } from '@/components/IconFont';

import { useHistory } from 'react-router-dom';

const StoreAppInfo: React.FC = () => {
  const history = useHistory();

  const renderManageInfo = () => {
    return (
      <ul className={cls['manage-info']}>
        <li className={`${cls['con']} flex `}>
          <div className={cls['con-name']}>后台设置</div>
          <span className={cls['blue-txt']}>
            打开应用管理后台
            <SendOutlined className={cls['blue-txt-icon']} rotate={-45} />
          </span>
        </li>
        <li className={`${cls['con']} flex `}>
          <div className={cls['con-name']}>应用分配</div>
          <span className={cls['blue-txt']}>编辑</span>
        </li>
        <li className={`${cls['con']} flex `}>
          <div className={cls['con-name']}></div>
          <div className={cls['user-show']}>
            {userCard({
              userList: [{ name: '测试1' }, { name: '测试2' }, { name: '测试3' }],
              roleName: '应用角色1',
            })}
            {userCard({ roleName: '应用角色33' })}
          </div>
        </li>
      </ul>
    );
  };

  const userCard = (userInfo: any) => {
    const { userList = [], roleName = '应用角色' } = userInfo;

    return (
      <ul className={`${cls['user-card']} flex flex-direction-col`}>
        <li className={cls['card-title']}>
          <UserOutlined className={cls['card-title-icon']} />
          {roleName}
        </li>
        <li className={cls['card-con']}>
          {userList.length > 0 ? (
            userList.map((item: any, index: number) => {
              return (
                <Tag
                  icon={<CheckCircleOutlined />}
                  className={cls['user-tags']}
                  color="success"
                  key={index}>
                  {item.name}
                </Tag>
              );
            })
          ) : (
            <Tag icon={<TwitterOutlined />} className={cls['user-tags']} key={'22'}>
              未分配
            </Tag>
          )}
        </li>
      </ul>
    );
  };
  return (
    <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
      <Card
        className="base-info-wrap"
        title={
          <IconFont
            type="icon-jiantou-left"
            className={cls.RouterBackBtn}
            onClick={() => {
              history.goBack();
            }}
          />
        }
        extra={
          <Dropdown menu={{ items: [{ key: 'del', label: '删除' }] }} placement="bottom">
            <EllipsisOutlined
              style={{ fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
              rotate={90}
            />
          </Dropdown>
        }>
        {<AppBase props={[]} />}
      </Card>
      <Card className="manage-info-wrap" title={'应用管理'}>
        {renderManageInfo()}
      </Card>
    </div>
  );
};

export default StoreAppInfo;
