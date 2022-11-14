import { Avatar, Descriptions, List } from 'antd';
import React from 'react';
import { Person } from '../../module/org/index';

type PersonInfoCardProps = {
  person: Person;
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
        title={person.team?.name}
        description={person.code}
      />
      {''}
      <Descriptions column={2}>
        <Descriptions.Item label="昵称">{person.name}</Descriptions.Item>
        <Descriptions.Item label="手机号">{person.team?.code}</Descriptions.Item>
        <Descriptions.Item label="座右铭" span={2}>
          {person.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </List.Item>
  </>
);

export default PersonInfoCard;
