import { EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Tag, Dropdown } from 'antd';
import React from 'react';
import './index.less';
import AppLogo from '/img/appLogo.png';
import { common } from 'typings/common';
import orgCtrl from '@/ts/controller';
import { XFlowDefine } from '@/ts/base/schema';

interface IProps {
  current: XFlowDefine;
  className?: string;
  onClick?: (event?: any) => void;
  operation?: (_item: XFlowDefine) => common.OperationType[]; //操作区域数据
}

const AppCard: React.FC<IProps> = ({ className, current, onClick, operation }) => {
  return (
    <div className={`customCardWrap ${className}`}>
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          <Avatar className="card-title-left-logo" size={50} src={AppLogo} />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{current.name}</span>
              <Tag color="success">{current.code}</Tag>
              <Tag color="success">{current.isCreate ? '创建类' : '附加类'}</Tag>
            </div>
            <span className="app-size">
              需求主体: {orgCtrl.provider.findNameById(current.belongId)}
            </span>
          </div>
        </div>
        {operation && (
          <Dropdown
            className="card-title-extra"
            menu={{ items: operation(current) }}
            placement="bottom">
            <EllipsisOutlined rotate={90} />
          </Dropdown>
        )}
      </div>
      <ul className="card-content">
        <li className="card-content-desc con">{current.remark || '暂无描述'}</li>
        <li className="card-content-type con">{/* <Tag>{current.speciesId}</Tag> */}</li>
        <li className="card-content-date">创建于 {current.createTime}</li>
      </ul>
    </div>
  );
};

export default AppCard;
