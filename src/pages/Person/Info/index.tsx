import { Button, Card, Descriptions } from 'antd';
import React, { useState } from 'react';
import userCtrl from '@/ts/controller/setting/userCtrl';
import PersonInfoCompany from './components/MyCompanySetting';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import UserInfoEditModal from './components/EditUserInfo';
import cls from './index.module.less';

/**
 * 个人信息
 * @returns
 */
const PersonInfo: React.FC = () => {
  const user = userCtrl.user;
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  // 信息内容
  const content = (
    <div className={cls['person-info-info']}>
      <Card bordered={false}>
        <Descriptions
          title={
            <TeamIcon
              avatar={userCtrl.user.avatar}
              typeName="人员"
              size={60}
              preview={true}
            />
          }
          column={3}
          extra={
            <Button type="link" onClick={() => setShowEditModal(true)}>
              修改信息
            </Button>
          }>
          <Descriptions.Item label="昵称">{user!.target.name}</Descriptions.Item>
          <Descriptions.Item label="账号" span={2}>
            {user.target?.code}
          </Descriptions.Item>
          <Descriptions.Item label="姓名">{user.target.team?.name}</Descriptions.Item>
          <Descriptions.Item label="联系方式" span={2}>
            {user!.target.team?.code}
          </Descriptions.Item>
          <Descriptions.Item label="座右铭" span={2}>
            {user!.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
  // TODO 1、个人空间显示加入的公司；2、单位空间显示所在的部门、工作组、岗位
  return (
    <div className={cls['person-info-container']}>
      {content}
      <Card bordered={false} className={cls['person-info-company']}>
        <PersonInfoCompany />
      </Card>
      <UserInfoEditModal
        open={showEditModal}
        handleCancel={() => setShowEditModal(false)}
        handleOk={() => {
          setShowEditModal(false);
          userCtrl.changCallback();
        }}
      />
    </div>
  );
};

export default PersonInfo;
