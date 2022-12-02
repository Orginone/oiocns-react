import { Avatar, Descriptions, List } from 'antd';
import React from 'react';
import { IPerson } from '@/ts/core/target/itarget';

type PersonInfoCardProps = {
  person: IPerson;
};

/**
 * 人员名片
 * @param person 人员
 * @returns
 */
const PersonInfoCard: React.FC<PersonInfoCardProps> = ({ person }) => (
  <>
    <List.Item>
      <List.Item.Meta
        // TODO 改为真实用户头像
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size="large" />}
        // avatar={<Avatar size="large">{person.name.substring(0, 1)}</Avatar>}
        title={person.target.name}
        description={person.target.code}
      />
      <Descriptions column={2}>
        <Descriptions.Item label="昵称">{person.target.name}</Descriptions.Item>
        <Descriptions.Item label="手机号">{person.target.team?.code}</Descriptions.Item>
        <Descriptions.Item label="座右铭" span={2}>
          {person.target.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </List.Item>
  </>
);

export default PersonInfoCard;
