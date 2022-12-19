import { Button, Modal, Tabs, message } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ICompany, IPerson } from '@/ts/core/target/itarget';
import { ProColumns } from '@ant-design/pro-components';
import SearchCompany from '@/bizcomponents/SearchCompany';
import CardOrTable from '@/components/CardOrTableComp';
import { TargetType } from '@/ts/core/enum';
import { useHistory } from 'react-router-dom';
import { XTarget } from '@/ts/base/schema';
import cls from './index.module.less';

/**
 * 用户信息-加入的单位(公司)
 * @returns
 */
const PersonInfoCompany: React.FC = () => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list, setList] = useState<ICompany[]>([]);
  const [activeKey, setActiveKey] = useState<string>('1');
  const [searchCallback, setSearchCallback] = useState<XTarget[]>();

  useEffect(() => {
    getTableList();
  }, []);

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
    console.log(111);
    const joinCompanys = await person.getJoinedCompanys(false);
    if (parseInt(key) == 2) {
      const createCompanys: any[] = [];
      for (const comp of joinCompanys) {
        if (comp.target.createUser == person.target.id) {
          createCompanys.push(comp);
        }
      }
      setList(createCompanys);
    } else if (parseInt(key) == 3) {
      const otherCompanys: any[] = [];
      for (const comp of joinCompanys) {
        if (comp.target.createUser != person.target.id) {
          otherCompanys.push(comp);
        }
      }
      setList(otherCompanys);
    } else {
      setList(joinCompanys);
    }
    setActiveKey(key);
  };

  /**
   * @desc: 页码切换函数
   * @param {number} page
   * @param {number} pageSize
   * @return {*}
   */
  const handlePageChange = (page: number, pageSize: number) => {
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
    setList(joinCompanys);
  };

  const columns: ProColumns<ICompany>[] = [
    {
      title: '单位名称',
      key: 'name',
      width: 200,
      dataIndex: ['target', 'name'],
    },
    {
      title: '单位编码',
      key: 'code',
      width: 250,
      dataIndex: ['target', 'code'],
    },
    {
      title: '单位描述',
      key: 'remark',
      dataIndex: ['target', 'team', 'remark'],
    },
  ];

  // // 操作内容
  // const renderOperation = (item: ICompany): common.OperationType[] => {
  //   return [
  //     {
  //       key: 'companyInfo',
  //       label: '单位信息维护',
  //       onClick: () => {
  //         console.log('按钮事件', 'publish', item);
  //       },
  //     },
  //     {
  //       key: 'getJoinGroup',
  //       label: '查看申请',
  //       onClick: () => {
  //         console.log('按钮事件', 'share', item);
  //       },
  //     },
  //     {
  //       key: 'joinCompany',
  //       label: '加入单位',
  //       onClick: () => {
  //         console.log('按钮事件', 'detail', item);
  //         // props.setShowDepartment(true);
  //       },
  //     },
  //   ];
  // };

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
          <Button type="link" onClick={() => history.push('/todo/org')}>
            查看申请记录
          </Button>
          <Button type="link" onClick={() => setIsModalOpen(true)}>
            加入单位
          </Button>
        </div>
      </div>

      <Tabs
        defaultActiveKey={activeKey}
        onChange={(key: string) => setTabName(key)}
        items={[
          { label: `全部`, key: '1' },
          { label: `创建的`, key: '2' },
          { label: `已加入`, key: '3' },
        ]}
      />

      <CardOrTable<ICompany>
        params={{ activeKey }}
        dataSource={list}
        total={list.length}
        showChangeBtn={false}
        hideOperation={true}
        columns={columns}
        onChange={handlePageChange}
        rowKey={'id'}
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
        <SearchCompany
          searchCallback={setSearchCallback}
          searchType={TargetType.Company}
        />
      </Modal>
    </div>
  );
};

export default PersonInfoCompany;
