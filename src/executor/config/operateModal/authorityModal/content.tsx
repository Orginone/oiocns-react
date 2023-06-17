import { Descriptions } from 'antd';
import React from 'react';
import cls from './index.module.less';
import { IAuthority } from '@/ts/core';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';

type IProps = {
  current: IAuthority;
};
/**
 * 权限设置
 * @returns
 */
const AuthorityContent: React.FC<IProps> = ({ current }) => {
  // 角色信息内容
  return current ? (
    <div className={cls['company-dept-content']}>
      <Descriptions
        title="权限信息"
        bordered
        column={2}
        size="small"
        labelStyle={{ textAlign: 'center' }}
        contentStyle={{ textAlign: 'center' }}>
        <Descriptions.Item label="名称">{current.name}</Descriptions.Item>
        <Descriptions.Item label="编码">{current.code}</Descriptions.Item>
        <Descriptions.Item label="创建人">
          <EntityIcon entityId={current.metadata.createUser} size={22} />
          <strong>{current.creater.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {current.metadata.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {current.remark}
        </Descriptions.Item>
      </Descriptions>
    </div>
  ) : (
    <></>
  );
};

export default AuthorityContent;
