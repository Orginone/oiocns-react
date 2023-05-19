import React from 'react';
import { Descriptions } from 'antd';
import { ITeam } from '@/ts/core';
import EntityInfo from '../EntityInfo';
interface IProps {
  entity: ITeam;
  extra?: any;
}
/**
 * @description: 机构信息内容
 * @return {*}
 */
const Description: React.FC<IProps> = ({ entity, extra }: IProps) => {
  return (
    <EntityInfo
      entity={entity}
      extra={extra}
      other={
        <Descriptions.Item label="加入">
          {entity.metadata.public ? '开放加入' : '需申请加入'}
        </Descriptions.Item>
      }
    />
  );
};
export default Description;
