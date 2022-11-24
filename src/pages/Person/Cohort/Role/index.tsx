import { Typography } from 'antd';
import React, { useState,useEffect } from 'react';
import Person from '../../../../bizcomponents/PersonInfo/index';
import CardOrTable from '../../../../components/CardOrTableComp';
import { CertificateType } from '../../../../../typings/Certificate';
import cls from './index.module.less';
import CohortController from '../../../../ts/controller/cohort/index';
import {schema} from '../../../../../src/ts/base'
import AddRole from './addRole/index'
import type { ProColumns } from '@ant-design/pro-components';
// import API from '@/services';

/**
 * 个人信息
 * @returns
 */
const RoleManage: React.FC<any> = (props) => {
  // const service = new CertificateService({
  //   nameSpace: 'myCertificate',
  //   searchApi: API.product.searchOwnProduct,
  //   createApi: API.product.register,
  //   deleteApi: API.product.delete,
  //   updateApi: API.product.update,
  // });
  // console.log(service);
  const [data, setData] = useState<schema.XAuthority[]>();
  const [open, setOpen] = useState<boolean>(false);
  // const [id, setId] = useState<string>();

  useEffect(() => {
    getTableList()
  }, []);
  useEffect(() => {
    CohortController.setCallBack(setData);
  }, []);
  useEffect(() => {
    console.log("值发生了改变");
    
  }, [data]);
  const getTableList = async () => {
    const data = await CohortController.getRoleList(props.location.state.cohortId)
    console.log("值",data[0])
    setData([data[0]])
  };
  
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
  const { Title } = Typography;
  const divStyle: React.CSSProperties = {
    marginTop: '55px',
  };
  const renderOperation = (
    item: schema.XAuthority,
  ): CertificateType.OperationType[] => {
    return [
      {
        key: 'add',
        label: '新增',
        onClick: () => {
          setOpen(true)
          console.log('按钮事件', 'add', item);
        },
      },
    ];
  };
  const total: number = data&&data.length?data.length:0;
  const Page: number = 10;
 
  // service.getList<Page>(params);

  const tableAlertRender = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys);
  };
  // const renderCardFun = (dataArr: schema.XAuthority[]): React.ReactNode[] => {
  //   return dataArr.map((item: schema.XAuthority) => {
  //     return (
  //       <Certificate
  //         className="card"
  //         data={item}
  //         key={item.id}
  //         defaultKey={{
  //           name: 'cardName',
  //           size: 'price',
  //           type: 'sellAuth',
  //           desc: 'remark',
  //           creatTime: 'createTime',
  //         }}
  //         operation={renderOperation}
  //       />
  //     );
  //   });
  // };
  // TODO 1、个人空间显示加入的公司；2、单位空间显示所在的部门、工作组、岗位
  return (
    <div className={cls['person-info-container']}>
      <div>
        <Person />
      </div>
       <AddRole open = {open} data = {data!} setOpen = {setOpen} id = {props.location.state.cohortId} />
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
        {data&&<CardOrTable<schema.XAuthority>
          dataSource={data}
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
          // renderCardContent={renderCardFun}
          // defaultPageType={'table'}
          // defaultExpandedRowKeys = {['0']}
          showChangeBtn={true}
          operation={renderOperation}
          columns={certificateColumn as any}
          style={divStyle}
          // onChange={handlePageChange}
          rowKey={'id'}
          childrenColumnName={data?'nodes':''}
          expandable={{defaultExpandAllRows:true}}
          // defaultExpandAllRows={data?true:false}
        />}
      </div>
    </div>
  );
};

export default RoleManage;
