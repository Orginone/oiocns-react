import { EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Tag, Dropdown, Menu, Modal, Space, Typography } from 'antd';
import React, { useState } from 'react';
import './index.less';
import AppLogo from '@/assets/img/appLogo.png';
import { MarketTypes } from 'typings/marketType';
import Cohort from '@/ts/core/target/cohort';
import CohortMemberList from '../CohortMemberList';
interface defaultObjType {
  name: string;
  size: number | string;
  type: string;
  desc: string;
  creatTime: string | number;
}
const { Text } = Typography;
interface AppCardType {
  data: Cohort; //props
  className?: string;
  defaultKey?: defaultObjType; // 卡片字段 对应数据字段
  // eslint-disable-next-line no-unused-vars
  onClick?: (event?: any) => void;
  // eslint-disable-next-line no-unused-vars
  operation?: (_item: Cohort) => MarketTypes.OperationType[]; //操作区域数据
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
  const {} = { ...defaultObj, ...defaultKey };
  /**
   * @desc: 操作按钮区域
   * @param {any} item - 表格单条数据 data
   * @return {Menu} - 渲染 按钮组
   */
  const menu = () => {
    return <Menu items={operation && operation(data)} />;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const Title = () => {
    return (
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          <Avatar src="https://joeschmoe.io/api/v1/random" size={60} />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{data.target.name || '--'}</span>
            </div>
            <span className="app-size">{data.target.team?.remark || '--'}</span>
          </div>
        </div>
        <Dropdown className="card-title-extra" overlay={menu} placement="bottom">
          <EllipsisOutlined rotate={90} />
        </Dropdown>
      </div>
    );
  };

  return (
    <div className={`customCardWrap ${className}`}>
      <Title />
      <ul className="card-content">
        {/* <li className="card-content-type con">
          {data[typeName] ? <Tag>{data[typeName]}</Tag> : ''}
        </li> */}
        <li className="card-content-date">
          <span style={{ float: 'right' }} className="app-size">
            归属:apex
          </span>
        </li>
        <li className="card-content-date">我的身份:管理员</li>
        <li className="card-content-date">群组编号:{data.target.code}</li>
        <li className="card-content-date">
          <span>创建于 {data.target.createTime || '--'}</span>
          <a type="link" style={{ float: 'right' }} onClick={() => setIsModalOpen(true)}>
            详情
          </a>
        </li>
      </ul>
      <Modal
        title="详情"
        open={isModalOpen}
        onOk={handleOk}
        width={850}
        onCancel={handleCancel}>
        <CohortMemberList cohortData={data} />
      </Modal>
    </div>
  );
};

export default AppCardComp;
