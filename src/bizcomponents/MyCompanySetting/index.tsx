import { Button, Modal, Tabs, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';

import CardOrTable from '@/components/CardOrTableComp';
import { Company } from '@/module/org';
import companyService from '@/module/org/company';
// import { useQuery } from '@tanstack/react-query';
import { User } from 'typings/user';

import useStore from '@/store';
import type * as schema from '@/ts/base/schema';

import cls from './index.module.less';
import SearchCompany from '@/bizcomponents/SearchCompany';
import ApplyInfoService from './ApplyInfo';
import Provider from '@/ts/core/provider';
import Person from '@/ts/core/target/person';

interface PersonInfoObj {
  setShowDepartment: (isbool: boolean) => void; // 控制是否显示公司
}

/**
 * 用户信息-加入的单位(公司)
 * @returns
 */
const PersonInfoCompany: React.FC<PersonInfoObj> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyInfoOpen, setApplyInfoOpen] = useState(false);

  const [list, setList] = useState<Company[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [joinKey, setJoinKey] = useState<string>('');

  const { user } = useStore((state) => ({ ...state }));

  useEffect(() => {
    getTableList();
    setTotal(10);

    props.setShowDepartment(false);

  }, []);

  const showDepartment = () => {
    props.setShowDepartment(true);
  };

  const showApplyModal = async () => {
    setApplyInfoOpen(true);
  };

  const showModal = () => {
    // 第一次进入页面的时候 是否选中
    setJoinKey('');
    setIsModalOpen(true);
  };

  const handleApplyOk = () => {
    setJoinKey('1');
    setApplyInfoOpen(false);
  };

  const handleApplyCancel = () => {
    setApplyInfoOpen(false);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    if (joinKey == '') {
      message.error('请选中要加入的单位！');
    } else {
      let thisSelectKey = joinKey;
      // code msg success
      const responseObj = await companyService.applyJoin(thisSelectKey);
      if (responseObj.success) {
        message.info('申请加入单位成功');
      } else {
        message.error('申请加入单位失败：' + responseObj.msg);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setTabName = (key: string) => {
    console.log(key);
  };

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

    // 从提供器里面取人员。 
    const person: Person = Provider.getPerson;
    const joinCompanys = await person.getJoinedCompanys();
    console.log("===获取到的内核数据！ ", joinCompanys);

    // const companys = await Userdata.getInstance().searchCompany({
    //   page: 1,
    //   pageSize: 100,
    //   filter: '91330304254498785G'
    // });
    // console.log("===获取到的内核数据2！ ", companys);

    const { data } = await companyService.searchCompany({
      page: 1,
      pageSize: 100,
    });

    // const data2 = useQuery<Company[]>(['company.getJoinedCompany'], () =>
    //   companyService.getJoinedCompany({ page: 1, pageSize: 1000 }),
    // );
    const joinData = await companyService.getJoinedCompany({
      page: 1,
      pageSize: 1000,
    });


    setList(joinData);
    setTotal(joinData.length);
  };

  const columns: ColumnsType<Company> = [
    {
      title: '单位名称',
      dataIndex: 'name',
    },
    {
      title: '单位编码',
      dataIndex: 'code',
    },
    {
      title: '单位描述',
      dataIndex: 'typeName',
    },
  ];

  // 操作内容
  const renderOperation = (item: Company): User.OperationType[] => {
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
        label: '查看申请',
        onClick: () => {
          console.log('按钮事件', 'share', item);
        },
      },
      {
        key: 'joinCompany',
        label: '加入单位',
        onClick: () => {
          console.log('按钮事件', 'detail', item);
          props.setShowDepartment(true);
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
          <strong>单位设置</strong>
        </Title>
        <div>
          <Button type="link" onClick={showDepartment}>
            部门岗位
          </Button>
          <Button type="link" onClick={showApplyModal}>
            查看申请记录
          </Button>
          <Button type="link" onClick={showModal}>
            加入单位
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        onChange={(key: string) => {
          setTabName(key);
          // 切换
        }}
        items={[
          {
            label: `全部`,
            key: '1',
          },
          {
            label: `创建的`,
            key: '2',
          },
          {
            label: `已加入`,
            key: '3',
          },
        ]}
      />

      <CardOrTable
        dataSource={list}
        total={total}
        showChangeBtn={false}
        hideOperation={true}
        // operation={renderOperation}
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
        destroyOnClose={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}>
        <div>
          <SearchCompany joinKey={joinKey} setJoinKey={setJoinKey}></SearchCompany>
        </div>
      </Modal>

      <Modal
        title="查看申请记录"
        destroyOnClose={true}
        open={applyInfoOpen}
        onOk={handleApplyOk}
        onCancel={handleApplyCancel}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="ok" type="primary" onClick={handleApplyOk}>
            知道了
          </Button>,
        ]}
        width={900}>
        <div>
          <ApplyInfoService />
        </div>
      </Modal>
    </div>
  );
};

export default PersonInfoCompany;
