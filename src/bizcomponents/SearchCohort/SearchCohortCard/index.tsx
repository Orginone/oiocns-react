import { UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import { schema } from '../../../ts/base';
import Cohort from '@/ts/core/target/cohort';
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
}

const CohortListCard: React.FC<AppCardType> = ({ className, data }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    getname();
  }, []);

  const getname = async () => {
    const res = await CohortController.getName(new Cohort(data));
    setName(res);
    console.log('获取归属', name);
  };
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
          <li className="card-content-date">
            <span style={{ float: 'right' }} className="app-size">
              归属:{name}
            </span>
          </li>
          <li className="card-content-date">我的身份:管理员</li>
          <li className="card-content-date">群组编号:{data.code}</li>

          <li className="card-content-date">
            <span>创建于 {data.createTime || '--'} </span>
            <Button
              style={{ float: 'right', border: 'none' }}
              icon={
                <UsergroupAddOutlined style={{ fontSize: '25px', color: '#808080' }} />
              }
            />
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default CohortListCard;
