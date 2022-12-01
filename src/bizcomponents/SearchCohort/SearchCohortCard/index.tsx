import { UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Typography, Col } from 'antd';
import React from 'react';
import './index.less';
import { schema } from '../../../ts/base';
interface defaultObjType {
  name: string;
  size: number | string;
  type: string;
  desc: string;
  creatTime: string | number;
}
interface AppCardType {
  data: schema.XTarget; //props
  className?: string;
  defaultKey?: defaultObjType; // 卡片字段 对应数据字段
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
}
const defaultObj = {
  name: 'name', //名称
  size: 'size', //大小
  type: 'type', //是否免费
  desc: 'desc', //描述
  typeName: 'typeName', //应用类型
  creatTime: 'creatTime', //上架时间
};

const CohortListCard: React.FC<AppCardType> = ({ className, data, defaultKey }) => {
  const {} = { ...defaultObj, ...defaultKey };
  /**
   * @desc: 操作按钮区域
   * @param {any} item - 表格单条数据 data
   * @return {Menu} - 渲染 按钮组
   */

  const Title = () => {
    return (
      <div className="card-title flex">
        <div className="card-title-left">
          <Avatar src="https://joeschmoe.io/api/v1/random" size={60} />
          <div className="card-title-left-info">
            <div className="app-name">
              <span className="app-name-label">{data.name || '--'}</span>
            </div>
            <span className="app-size">{data.team?.remark || '--'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Col span={12}>
      <div className={`customCardWrap ${className}`}>
        <Title />
        <ul className="card-content">
          {/* <li className="card-content-type con">
          {data[typeName] ? <Tag>{data[typeName]}</Tag> : ''}
        </li> */}
          <li className="card-content-date">
            创建于 {data.createTime || '--'}
            <span style={{ float: 'right' }} className="app-size">
              归属:apex
            </span>
          </li>
          <li className="card-content-date">我的身份:管理员</li>
          <li className="card-content-date">
            群组编号:{data.code}
            <Button
              style={{ float: 'right', border: 'none' }}
              icon={
                <UsergroupAddOutlined style={{ fontSize: '25px', color: '#808080' }} />
              }
              // onClick={onClick}
            />
            {/* <UsergroupAddOutlined style={{ float: 'right', fontSize: '25px' }} /> */}
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default CohortListCard;
