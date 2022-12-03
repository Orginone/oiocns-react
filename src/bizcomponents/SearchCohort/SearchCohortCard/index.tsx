import { UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import { schema } from '../../../ts/base';
import Cohort from '@/ts/core/target/cohort';
import userCtrl from '@/ts/controller/setting/userCtrl';
interface CohortCardType {
  data: schema.XTarget; //props
  className?: string;
}

const CohortListCard: React.FC<CohortCardType> = ({ className, data }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    getname();
  }, []);

  const getname = async () => {
    const cohort = new Cohort(data);
    const res = (await cohort.getMember()).filter((obj) => obj.id === data.belongId);
    setName(res[0].team?.name!);
  };
  const applyCohort = async (data: schema.XTarget) => {
    const res = await userCtrl.User?.applyJoinCohort(data.id);
    if (res?.success) {
      message.success('发起申请成功');
    } else {
      message.error(res?.msg);
    }
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
              onClick={() => applyCohort(data)}
            />
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default CohortListCard;
