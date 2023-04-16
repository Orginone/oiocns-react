import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import React from 'react';
import { XFlowDefine } from '@/ts/base/schema';
import './index.less';
import { ImStackoverflow } from 'react-icons/im';
interface FlowCardType {
  data: XFlowDefine;
  className?: string;
  onClick?: (event?: any) => void;
  operation?: (_item: XFlowDefine) => any[];
}

const FlowCard: React.FC<FlowCardType> = ({ className, data, onClick, operation }) => {
  const Title = () => {
    return (
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          <ImStackoverflow />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{data.name || '--'}</span>
            </div>
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
        <li className="card-content-desc con">{data.remark || '暂无描述'}</li>
        <li className="card-content-date">创建于 {data.createTime}</li>
      </ul>
    </div>
  );
};

export default FlowCard;
