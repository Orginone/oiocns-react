import { AiOutlineEllipsis } from 'react-icons/ai';
import { Dropdown } from 'antd';
import React from 'react';
import './index.module.less';
import { ImStackoverflow } from 'react-icons/im';
import { IWorkDefine } from '@/ts/core/thing/app/work/workDefine';
interface FlowCardType {
  data: IWorkDefine;
  className?: string;
  onClick?: (event?: any) => void;
  operation?: (_item: IWorkDefine) => any[];
}

const FlowCard: React.FC<FlowCardType> = ({ className, data, onClick, operation }) => {
  const Title = () => {
    return (
      <div className="card-title flex" onClick={onClick}>
        <div className="card-title-left">
          <ImStackoverflow />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{data.metadata.name || '--'}</span>
            </div>
          </div>
        </div>
        <Dropdown
          className="card-title-extra"
          menu={{ items: operation && operation(data) }}
          placement="bottom">
          <AiOutlineEllipsis rotate={90} />
        </Dropdown>
      </div>
    );
  };

  return (
    <div className={`customCardWrap ${className}`}>
      <Title />
      <ul className="card-content">
        <li className="card-content-desc con">{data.metadata.remark || '暂无描述'}</li>
        <li className="card-content-date">创建于 {data.metadata.createTime}</li>
      </ul>
    </div>
  );
};

export default FlowCard;
