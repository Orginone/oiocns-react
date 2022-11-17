import { Button, Space } from 'antd';
import Certificate from '@/components/CettificateComp';
import { Typography, Divider } from 'antd';
import React, { useState } from 'react';
import Person from '../../../bizcomponents/PersonInfo/index';
import { Page } from '@/module/typings';
import CardOrTable from '@/components/CardOrTableComp';
import { CertificateType } from 'typings/Certificate';
import { certificateColumn } from '@/components/CardOrTableComp/config';
import cls from './index.module.less';
import CertificateService from '@/module/certificate/Certificate';
import API from '@/services';

/**
 * 个人信息
 * @returns
 */
const PersonInfo: React.FC = () => {
  const service = new CertificateService({
    nameSpace: 'myCertificate',
    searchApi: API.product.searchOwnProduct,
    createApi: API.product.register,
    deleteApi: API.product.delete,
    updateApi: API.product.update,
  });
  console.log(service);

  //模拟数据
  const list: any = [
    {
      id: '358270758297931776',
      cardName: '浙江财政',
      network: '代速速发总结地金重体理存空期',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
    {
      id: '358545770678356320',
      cardName: '浙大',
      network: '社进青起划自看特公精律存',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
    {
      id: '358541770678456320',
      cardName: '杭电',
      network: '周往小大头积动段斯美取',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
    {
      id: '358545775678456320',
      cardName: '北大',
      network: '大苏打倒萨大苏打',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
    {
      id: '358545770698456320',
      cardName: '清华',
      network: '恶趣味全额',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
    {
      id: '359661017162190848',
      cardName: '福大',
      network: '只需中心城中心',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
    {
      id: '361171414562246656',
      cardName: '福大大',
      network: '只需中心城中心',
      address: '浙江财政',
      joinDate: '1999-12-10',
    },
  ];
  // 卡片内容渲染函数
  // const renderCardFun = (dataArr: MarketTypes.certificateType[]): React.ReactNode[] => {
  //   return dataArr.map((item: MarketTypes.certificateType) => {
  //     return (
  //       <AppCard
  //         className="card"
  //         data={item}
  //         key={item.id}
  //         defaultKey={{
  //           name: 'caption',
  //           size: 'price',
  //           type: 'sellAuth',
  //           desc: 'remark',
  //           creatTime: 'createTime',
  //         }}
  //         // operation={renderOperation}
  //       />
  //     );
  //   });
  // };
  const { Title } = Typography;
  const divStyle: React.CSSProperties = {
    marginTop: '55px',
  };
  const renderOperation = (
    item: CertificateType.cerManageType,
  ): CertificateType.OperationType[] => {
    return [
      {
        key: 'exportTearms',
        label: '导出助记词',
        onClick: () => {
          console.log('按钮事件', 'exportTearms', item);
        },
      },
      {
        key: 'exportKey',
        label: '导出私钥',
        onClick: () => {
          console.log('按钮事件', 'exportKey', item);
        },
      },
      {
        key: 'cardsynchro',
        label: '卡包同步',
        onClick: () => {
          console.log('按钮事件', 'cardsynchro', item);
        },
      },
      {
        key: 'white',
        label: '白名单',
        onClick: () => {
          console.log('按钮事件', 'white', item);
        },
      },
      {
        key: 'network',
        label: '卡包管理',
        onClick: () => {
          console.log('按钮事件', 'network', item);
        },
      },
    ];
  };
  const total: number = list.length;
  const Page: number = 10;
  const params = {
    page: 10,
    pageSize: 1,
    filter: 'search',
  };
  service.getList<Page>(params);

  const tableAlertRender = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys);
  };
  const renderCardFun = (dataArr: CertificateType.cerManageType[]): React.ReactNode[] => {
    return dataArr.map((item: CertificateType.cerManageType) => {
      return (
        <Certificate
          className="card"
          data={item}
          key={item.id}
          defaultKey={{
            name: 'cardName',
            size: 'price',
            type: 'sellAuth',
            desc: 'remark',
            creatTime: 'createTime',
          }}
          operation={renderOperation}
        />
      );
    });
  };
  // TODO 1、个人空间显示加入的公司；2、单位空间显示所在的部门、工作组、岗位
  return (
    <div className={cls['person-info-container']}>
      <div>
        <Person />
      </div>
      <div>
        <div className={cls['person-info-H']}>
          <Title level={4}>证书管理</Title>
        </div>
        <div className={cls['person-info-link']}>
          <Space split={<Divider type="vertical" />}>
            <Button type="link">删除</Button>
            <Button type="link">查看申请记录</Button>
            <Button type="link">加入平台</Button>
            <Button type="link">创建地址</Button>
          </Space>
        </div>
      </div>
      {/* <div className={cls['person-info-company']}>
        <PersonInfoCompany></PersonInfoCompany>
      </div> */}
      <div>
        <CardOrTable<CertificateType.cerManageType>
          dataSource={list}
          total={total}
          page={Page}
          tableAlertRender={tableAlertRender}
          rowSelection={
            {
              // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
              // 注释该行则默认不显示下拉选项
              // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              // defaultSelectedRowKeys: [1],
            }
          }
          renderCardContent={renderCardFun}
          // defaultPageType={'table'}
          showChangeBtn={true}
          operation={renderOperation}
          columns={certificateColumn as any}
          style={divStyle}
          // onChange={handlePageChange}
          rowKey={'id'}
        />
      </div>
    </div>
  );
};

export default PersonInfo;
