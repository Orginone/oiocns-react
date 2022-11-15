import { EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Tag, Dropdown, Menu, Card } from 'antd';
import React from 'react';
import './index.less';
import AppLogo from '@/assets/img/appLogo.png';
import { CertificateType } from '../../../typings/Certificate';
interface defaultObjType {
  name: string;
  size: number | string;
  type: string;
  desc: string;
  creatTime: string | number;
}

interface CertificatesType {
  data: any; //props
  className?: string;
  defaultKey?: defaultObjType; // 卡片字段 对应数据字段
  // eslint-disable-next-line no-unused-vars
  onClick?: (event?: any) => void;
  // eslint-disable-next-line no-unused-vars
  operation?: (_item: CertificateType.cerManageType) => CertificateType.OperationType[]; //操作区域数据
}
const defaultObj = {
  name: 'name', //名称
  size: 'size', //大小
  type: 'type', //是否免费
  desc: 'desc', //描述
  typeName: 'typeName', //应用类型
  creatTime: 'creatTime', //上架时间
};

const AppCardComp: React.FC<CertificatesType> = ({
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
  /**
   * @desc: 操作按钮区域
   * @param {any} item - 表格单条数据 data
   * @return {Menu} - 渲染 按钮组
   */
  const menu = () => {
    return <Menu items={operation && operation(data)} />;
  };
  const gridStyle: React.CSSProperties = {
    width: '20%',
    textAlign: 'center',
  };

  const Title = () => {
    return (
      <Card.Grid style={gridStyle}>
        <Avatar className="card-title-left-logo" size={50} src={AppLogo} />
        <div>{data[name] || '--'}</div>
      </Card.Grid>
      // <div className="card-title flex" onClick={onClick}>
      //   <div className="card-title-left">
      //     <Avatar className="card-title-left-logo" size={50} src={AppLogo} />
      //     <div className="card-title-left-info">
      //       {/* <span className="app-size">{data[size] || '--'}MB</span> */}
      //     </div>
      //     <div className="app-name">
      // <br></br><span className="app-name-label">{data[name] || '--'}</span>
      //       </div>
      //   </div>
      // </div>
    );
  };

  return <Title />;
};

export default AppCardComp;
