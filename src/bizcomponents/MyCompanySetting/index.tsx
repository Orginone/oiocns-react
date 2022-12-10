import { Button, Modal, Tabs, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import SearchCompany from '@/bizcomponents/SearchCompany';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ICompany, IPerson } from '@/ts/core/target/itarget';
import { common } from 'typings/common';
import { TargetType } from '@/ts/core/enum';
import { useHistory } from 'react-router-dom';
import { XTarget } from '@/ts/base/schema';

interface PersonInfoObj {
  setShowDepartment: (isbool: boolean) => void; // 控制是否显示公司
}

/**
 * 用户信息-加入的单位(公司)
 * @returns
 */
const PersonInfoCompany: React.FC<PersonInfoObj> = (props) => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [applyInfoOpen, setApplyInfoOpen] = useState(false);

  const [list, setList] = useState<ICompany[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [searchCallback, setSearchCallback] = useState<XTarget[]>();

  useEffect(() => {
    getTableList();
    setTotal(10);

    props.setShowDepartment(false);
  }, []);

  // const showDepartment = () => {
  //   props.setShowDepartment(true);
  // };

  // const showApplyModal = async () => {
  //   setApplyInfoOpen(true);
  // };

  const showModal = () => {
    setIsModalOpen(true);
  };

  // const handleApplyOk = () => {
  //   setJoinKey('1');
  //   setApplyInfoOpen(false);
  // };

  // const handleApplyCancel = () => {
  //   setApplyInfoOpen(false);
  // };

  const handleOk = async () => {
    setIsModalOpen(false);
    if (searchCallback && searchCallback.length > 0) {
      if (searchCallback && searchCallback.length > 0) {
        searchCallback.forEach(async (user) => {
          if (await userCtrl.user.applyJoinCompany(user.id, TargetType.Company)) {
            message.success('已申请加入单位成功.');
          }
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setTabName = async (key: string) => {
    // 1 2 3
    const person: IPerson = userCtrl.user;
    const joinCompanys = await person.getJoinedCompanys(false);
    // console.log(joinCompanys);
    if (parseInt(key) == 2) {
      const createCompanys: any[] = [];
      for (const comp of joinCompanys) {
        if (comp.target.createUser == person.target.id) {
          createCompanys.push(comp);
        }
      }
      setList(createCompanys);
      setTotal(createCompanys.length);
    } else if (parseInt(key) == 3) {
      const otherCompanys: any[] = [];
      for (const comp of joinCompanys) {
        if (comp.target.createUser != person.target.id) {
          otherCompanys.push(comp);
        }
      }
      setList(otherCompanys);
      setTotal(otherCompanys.length);
    } else {
      setList(joinCompanys);
      setTotal(joinCompanys.length);
    }
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

  /**
   * @desc: 获取展示列表
   * @param {string} searchKey 搜索关键词
   * @param {boolean} isGofirst 是否返回第一页
   * @return {*}
   */
  const getTableList = async (req = {}, searchKey = '', isGofirst = false) => {
    console.log(req, searchKey, isGofirst);
    const person: IPerson = userCtrl.user;
    const joinCompanys = await person.getJoinedCompanys(false);
    console.log(joinCompanys);
    setList(joinCompanys);
    setTotal(joinCompanys.length);
  };

  const columns: ColumnsType<ICompany> = [
    {
      title: '单位名称',
      key: 'name',
      render: (item) => item.target.name,
    },
    {
      title: '单位编码',
      key: 'code',
      render: (item) => item.target.code,
    },
    {
      title: '单位描述',
      key: 'remark',
      render: (item) => item.target.team.remark,
    },
  ];

  // 操作内容
  const renderOperation = (item: ICompany): common.OperationType[] => {
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
    record;
  };

  return (
    <div className={cls['person-info-content-container']}>
      <div className={cls['person-info-content-header']}>
        <Title level={4}>
          <strong>单位设置</strong>
        </Title>
        <div>
          {/* <Button type="link" onClick={showDepartment}>
            部门岗位
          </Button> */}
          <Button type="link" onClick={() => history.push('/todo/org')}>
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
          <SearchCompany
            searchCallback={setSearchCallback}
            searchType={TargetType.Company}
          />
        </div>
      </Modal>

      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default PersonInfoCompany;
