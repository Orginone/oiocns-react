import { EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Tag, Dropdown } from 'antd';
import React from 'react';
import './index.less';
import AppLogo from '/img/appLogo.png';
import { MarketTypes } from 'typings/marketType';
import { IProduct } from '@/ts/core';
interface defaultObjType {
  name: string;
  size: number | string;
  type: string;
  desc: string;
  creatTime: string | number;
}

interface AppCardType {
  data: IProduct; //props
  className?: string;
  defaultKey?: defaultObjType; // 卡片字段 对应数据字段
  // eslint-disable-next-line no-unused-vars
  onClick?: (event?: any) => void;
  // eslint-disable-next-line no-unused-vars
  operation?: (_item: IProduct) => MarketTypes.OperationType[]; //操作区域数据
}
const defaultObj = {
  name: 'name', //名称
  size: 'size', //大小
  type: 'type', //是否免费
  desc: 'desc', //描述
  typeName: 'typeName', //应用类型
  creatTime: 'creatTime', //上架时间
};

const AppCardComp: React.FC<AppCardType> = ({
  className,
  data,
  defaultKey,
  onClick,
  operation,
}) => {
  const {
    name = 'name',
    size = 'size',
    type = 'type',
    desc = 'desc',
    typeName = 'typeName',
    creatTime = 'creatTime',
  } = { ...defaultObj, ...defaultKey };

  const Title = () => {
    return (
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          <Avatar className="card-title-left-logo" size={50} src={AppLogo} />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{data.prod[name] || '--'}</span>
              <Tag color="success">{data.prod[type] || '暂无'}</Tag>
            </div>
            <span className="app-size">{data.prod[size] || '--'}MB</span>
          </div>
        </div>
        <Dropdown
          className="card-title-extra"
          menu={{ items: operation && operation(data) }}
          placement="bottom">
          <EllipsisOutlined rotate={90} />
        </Dropdown>
      </div>
    );
  };

  return (
    <div className={`customCardWrap ${className}`}>
      <Title />
      <ul className="card-content">
        <li className="card-content-desc con">{data.prod[desc] || '暂无描述'}</li>
        <li className="card-content-type con">
          {data.prod[typeName] ? <Tag>{data.prod[typeName]}</Tag> : ''}
        </li>
        <li className="card-content-date">创建于 {data.prod[creatTime] || '--'}</li>
      </ul>
    </div>
  );
};

export default AppCardComp;
