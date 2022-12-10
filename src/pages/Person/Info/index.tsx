import { Button, Card, Descriptions } from 'antd';
import Layout from 'antd/lib/layout/layout';
import React, { useState, useEffect } from 'react';

import userCtrl from '@/ts/controller/setting/userCtrl';
import PersonInfoDepartment from './Department';
import PersonInfoCompany from '@/bizcomponents/MyCompanySetting';
import UserInfoEditModal from '@/bizcomponents/EditUserInfo';
import cls from './index.module.less';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';

/**
 * 个人信息
 * @returns
 */
const PersonInfo: React.FC = () => {
  const user = userCtrl.user;
  const [showDepartment, setShowDepartment] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  useEffect(() => {
    // 用户修改的时候 ，处理代码 头像
  }, ['', userCtrl.user]);

  // 信息标题
  const title = (
    <div className={cls['person-info-title']}>
      <div style={{ fontSize: 100 }}>
        <TeamIcon avatar={userCtrl.user.avatar} typeName="人员" size={100} />
      </div>
      <div>
        <Button type="link" onClick={() => setShowEditModal(true)}>
          修改信息
        </Button>
        <Button type="link">修改密码</Button>
      </div>
    </div>
  );
  // 信息内容
  const content = (
    <div className={cls['person-info-info']}>
      <Card bordered={false}>
        <Descriptions title={title} column={2}>
          <Descriptions.Item label="昵称">{user!.target.name}</Descriptions.Item>
          {/* <Descriptions.Item label="性别">{}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{}</Descriptions.Item> */}
          <Descriptions.Item label="联系方式">
            {user!.target.team?.code}
          </Descriptions.Item>
          <Descriptions.Item label="座右铭" span={2}>
            {user!.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
  //
  // TODO 1、个人空间显示加入的公司；2、单位空间显示所在的部门、工作组、岗位
  return (
    <div className={cls['person-info-container']}>
      <Layout className={cls.container}>{content}</Layout>
      <Layout className={cls.container}>
        <Card bordered={false}>
          <div className={cls['person-info-company']}>
            {showDepartment ? (
              <PersonInfoDepartment
                setShowDepartment={setShowDepartment}></PersonInfoDepartment>
            ) : (
              <PersonInfoCompany
                setShowDepartment={setShowDepartment}></PersonInfoCompany>
            )}
          </div>
        </Card>
      </Layout>
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
