import Certificate from '../../../../components/CettificateComp/index';
import { Typography, Divider } from 'antd';
import React, { useState } from 'react';
import Person from '../../../../bizcomponents/PersonInfo/index';
import CardOrTable from '../../../../components/CardOrTableComp';
import { CertificateType } from '../../../../../typings/Certificate';
import cls from './index.module.less';
// import API from '@/services';

/**
 * 个人信息
 * @returns
 */
const RoleManage: React.FC = () => {
  // const service = new CertificateService({
  //   nameSpace: 'myCertificate',
  //   searchApi: API.product.searchOwnProduct,
  //   createApi: API.product.register,
  //   deleteApi: API.product.delete,
  //   updateApi: API.product.update,
  // });
  // console.log(service);

 const list:any = [
  {
    "id": "361356410044420096",
    "name": "管理员",
    "code": "super-admin",
    "remark": "组织最高管理者角色",
    "public": true,
    "status": 1,
    "createUser": "361356411520815104",
    "updateUser": "361356411520815104",
    "version": "1",
    "createTime": "2022-09-24 03:41:21.832",
    "updateTime": "2022-09-24 03:41:21.832",
    "nodes": [
        {
            "id": "361356410623234048",
            "name": "关系管理员",
            "code": "relation-admin",
            "remark": "组织内关系管理角色",
            "public": true,
            "parentId": "361356410044420096",
            "status": 1,
            "createUser": "361356411520815104",
            "updateUser": "361356411520815104",
            "version": "1",
            "createTime": "2022-09-24 03:41:21.971",
            "updateTime": "2022-09-24 03:41:21.971"
        },
        {
            "id": "361356410698731520",
            "name": "物资管理员",
            "code": "thing-admin",
            "remark": "组织内物资管理角色",
            "public": true,
            "parentId": "361356410044420096",
            "status": 1,
            "createUser": "361356411520815104",
            "updateUser": "361356411520815104",
            "version": "1",
            "createTime": "2022-09-24 03:41:21.988",
            "updateTime": "2022-09-24 03:41:21.988",
            "nodes": [
                {
                    "id": "361356410774228992",
                    "name": "应用管理员",
                    "code": "application-admin",
                    "remark": "组织内应用管理角色",
                    "public": true,
                    "parentId": "361356410698731520",
                    "status": 1,
                    "createUser": "361356411520815104",
                    "updateUser": "361356411520815104",
                    "version": "1",
                    "createTime": "2022-09-24 03:41:22.007",
                    "updateTime": "2022-09-24 03:41:22.007"
                }
            ]
        },
        {
            "id": "361356410849726464",
            "name": "商店管理员",
            "code": "market-admin",
            "remark": "组织内商店管理角色",
            "public": true,
            "parentId": "361356410044420096",
            "status": 1,
            "createUser": "361356411520815104",
            "updateUser": "361356411520815104",
            "version": "1",
            "createTime": "2022-09-24 03:41:22.024",
            "updateTime": "2022-09-24 03:41:22.024"
        }
    ]
}
 ]
  const certificateColumn: ProColumns<any>[] = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '编码',
    dataIndex: 'code',
  },
  {
    title: '所属',
    dataIndex: 'name',
  },
  {
    title: '是否公开',
    dataIndex: 'public',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];
  //模拟数据
  // const list: any = [
  //   {
  //     id: '358270758297931776',
  //     cardName: '浙江财政',
  //     network: '代速速发总结地金重体理存空期',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  //   {
  //     id: '358545770678356320',
  //     cardName: '浙大',
  //     network: '社进青起划自看特公精律存',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  //   {
  //     id: '358541770678456320',
  //     cardName: '杭电',
  //     network: '周往小大头积动段斯美取',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  //   {
  //     id: '358545775678456320',
  //     cardName: '北大',
  //     network: '大苏打倒萨大苏打',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  //   {
  //     id: '358545770698456320',
  //     cardName: '清华',
  //     network: '恶趣味全额',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  //   {
  //     id: '359661017162190848',
  //     cardName: '福大',
  //     network: '只需中心城中心',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  //   {
  //     id: '361171414562246656',
  //     cardName: '福大大',
  //     network: '只需中心城中心',
  //     address: '浙江财政',
  //     joinDate: '1999-12-10',
  //   },
  // ];
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
        key: 'add',
        label: '新增',
        onClick: () => {
          console.log('按钮事件', 'add', item);
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
  // service.getList<Page>(params);

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
          <Title level={4}>角色维护</Title>
        </div>
        {/* <div className={cls['person-info-link']}>
          <Space split={<Divider type="vertical" />}>
            <Button type="link">删除</Button>
            <Button type="link">查看申请记录</Button>
            <Button type="link">加入平台</Button>
            <Button type="link">创建地址</Button>
          </Space>
        </div> */}
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
          childrenColumnName  = {'nodes'}
        />
      </div>
    </div>
  );
};

export default RoleManage;
