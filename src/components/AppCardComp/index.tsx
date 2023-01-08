import { EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Tag, Dropdown } from 'antd';
import React from 'react';
import './index.less';
import AppLogo from '/img/appLogo.png';
import { common } from 'typings/common';
import { IProduct } from '@/ts/core';

interface IProps {
  current: IProduct;
  className?: string;
  onClick?: (event?: any) => void;
  operation?: (_item: IProduct) => common.OperationType[]; //操作区域数据
}

const AppCardComp: React.FC<IProps> = ({ className, current, onClick, operation }) => {
  return (
    <div className={`customCardWrap ${className}`}>
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          <Avatar className="card-title-left-logo" size={50} src={AppLogo} />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{current.prod.name || '--'}</span>
              <Tag color="success">{current.prod.typeName || '暂无'}</Tag>
            </div>
            <span className="app-size">{current.prod['size'] || '--'}MB</span>
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
        <li className="card-content-desc con">{current.prod.remark || '暂无描述'}</li>
        <li className="card-content-type con">
          <Tag>{current.prod.typeName}</Tag>
        </li>
        <li className="card-content-date">创建于 {current.prod.createTime}</li>
      </ul>
    </div>
  );
};

export default AppCardComp;
