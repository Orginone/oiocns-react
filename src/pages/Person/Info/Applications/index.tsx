import { Button, Modal, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';

import CardOrTable from '@/components/CardOrTableComp';
import { UserDept } from '@/module/org';
// import companyService from '@/module/org/company';
// import { useQuery } from '@tanstack/react-query';
import { User } from 'typings/user';

import cls from './index.module.less';
import SearchCompany from '@/bizcomponents/SearchCompany';

interface PersonInfoObj {
  setShowDepartment: (isbool: boolean) => void; // 控制是否显示公司
}

/**
 * 用户信息-加入的单位(公司)
 * @returns
 */
const PersonInfoCompany: React.FC<PersonInfoObj> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [list, setList] = useState<UserDept[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    getTableList();
    setTotal(10);
    console.log(page, total);
  }, []);

  const showCompany = () => {
    props.setShowDepartment(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setTabName = (key: string) => {
    console.log(key);
  };

  // const { data } = useQuery<Company[]>(['company.getJoinedCompany'], () =>
  //   companyService.getJoinedCompany({ page: 1, pageSize: 1000 }),
  // );

  /**
   * @desc: 页码切换函数
   * @param {number} page
   * @param {number} pageSize
   * @return {*}
   */
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    getTableList({ page, pageSize });
  };

  // const tableAlertRender = (selectedRowKeys: any[], selectedRows: any[]) => {};

  /**
   * @desc: 获取展示列表
   * @param {string} searchKey 搜索关键词
   * @param {boolean} isGofirst 是否返回第一页
   * @return {*}
   */
  const getTableList = async (req = {}, searchKey = '', isGofirst = false) => {
    // setList([...service.List]);
    // setTotal(service.Total);

    console.log(req, searchKey, isGofirst);
    let tt: UserDept[] = [
      {
        id: 1,
        order: 1,
        deptId: '1',
        deptName: '浙江财政',
        deptDesc: '单位描述1',
        createCompany: '浙江财政',
        createCompanyId: 1,
        joinDate: '2012-10-01',
      },
      {
        id: 2,
        order: 2,
        deptId: '2',
        deptName: '杭电',
        deptDesc: '单位描述2',
        createCompany: '杭州电子科技大学',
        createCompanyId: 2,
        joinDate: '2019-11-01',
      },
    ];

    setList(tt);
  };

  const columns: ColumnsType<UserDept> = [
    {
      title: '序号',
      dataIndex: 'order',
    },
    {
      title: '部门名称',
      dataIndex: 'createCompany',
    },
    {
      title: '部门编码',
      dataIndex: 'createCompanyId',
    },
    {
      title: '创建单位',
      dataIndex: 'deptDesc',
    },
  ];

  // 操作内容渲染函数
  const renderOperation = (item: UserDept): User.OperationType[] => {
    return [
      {
        key: 'companyInfo',
        label: '单位信息维护',
        onClick: () => {
          console.log('按钮事件', 'publish', item);
        },
      },
      {
        key: 'getJoinGroup',
        label: '查看申请记录',
        onClick: () => {
          console.log('按钮事件', 'share', item);
        },
      },
      {
        key: 'joinGroup',
        label: '加入集团',
        onClick: () => {
          console.log('按钮事件', 'detail', item);
        },
      },
    ];
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  };

  const getCheckboxProps = (record: any) => {
    console.log(record);
  };

  return (
    <div className={cls['person-info-content-container']}>
      <div className={cls['person-info-content-header']}>
        <Title level={4}>
          <strong>应用列表</strong>
        </Title>
      </div>

      <Tabs
        defaultActiveKey="1"
        onChange={(key: string) => {
          setTabName(key);
        }}
        items={[
          {
            label: `部门`,
            key: '1',
          },
          {
            label: `岗位`,
            key: '2',
          },
          {
            label: `应用`,
            key: '3',
          },
        ]}
      />

      <CardOrTable
        dataSource={list}
        total={total}
        showChangeBtn={false}
        operation={renderOperation}
        columns={columns as any}
        onChange={handlePageChange}
        rowKey={'id'}
        // bordered
        rowSelection={{
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }}
      />

      <Modal
        title="加入单位"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}>
        <div>
          <SearchCompany></SearchCompany>
        </div>
      </Modal>
    </div>
  );
};

export default PersonInfoCompany;
