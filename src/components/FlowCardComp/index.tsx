import { EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { XFlowDefine } from '@/ts/base/schema';
import flowLogo from '@/assets/img/flow.png';
import './index.less';
interface FlowCardType {
  data: XFlowDefine;
  className?: string;
  onClick?: (event?: any) => void;
  operation?: (_item: XFlowDefine) => any[];
}

const FlowCardComp: React.FC<FlowCardType> = ({
  className,
  data,
  onClick,
  operation,
}) => {
  useEffect(() => {}, []);

  const Title = () => {
    return (
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          {/* <Avatar src="https://joeschmoe.io/api/v1/random" size={60} /> */}
          <Avatar className="card-title-left-logo" size={50} src={flowLogo} />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{data.name || '--'}</span>
            </div>
            <span className="app-size">{data.remark || '--'}</span>
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
    </div>
  );
};

export default FlowCardComp;
