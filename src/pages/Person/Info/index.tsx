import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions } from 'antd';
import Layout from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';

import PersonInfoCompany from '@/bizcomponents/MyCompanySetting';
import PersonInfoDepartment from './Department';
import cls from './index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
/**
 * 个人信息
 * @returns
 */
const PersonInfo: React.FC = () => {
  const user = userCtrl.User.target;
  const [showDepartment, setShowDepartment] = useState<boolean>(false);

  // 信息标题
  const title = (
    <div className={cls['person-info-title']}>
      <div>
        <Title level={4}>
          <strong>当前用户</strong>
        </Title>
        <Avatar size={48} icon={<UserOutlined />} />
      </div>
      <div>
        <Button type="link">修改信息</Button>
        <Button type="link">修改密码</Button>
      </div>
    </div>
  );
  // 信息内容
  const content = (
    <div className={cls['person-info-info']}>
      <Card bordered={false}>
        <Descriptions title={title} column={2}>
          <Descriptions.Item label="昵称">{user.name}</Descriptions.Item>
          {/* <Descriptions.Item label="性别">{}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{}</Descriptions.Item> */}
          <Descriptions.Item label="联系方式">{user.team?.code}</Descriptions.Item>
          <Descriptions.Item label="座右铭" span={2}>
            {user.team?.remark}
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
    </div>
  );
};

export default PersonInfo;
