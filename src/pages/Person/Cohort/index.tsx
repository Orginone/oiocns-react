
import { Button, Space, Tabs, Card, Modal, message } from 'antd';
import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import PersonInfo from '../../../bizcomponents/PersonInfo/index'
import CardOrTable from '@/components/CardOrTableComp';
import { CohortConfigType } from 'typings/Cohort';
import { cohortColumn } from '@/components/CardOrTableComp/config';
import cls from './index.module.less';
import CohortService from '@/module/cohort/Cohort';
import API from '@/services';
import useStore from '../../../../src/store';
import CreateCohort from '../../../bizcomponents/cohort/index'
import UpdateCohort from '@/bizcomponents/cohort/UpdateCohort/index'
import Persons from '../../../bizcomponents/SearchPerson/index'
import AddCohort from '../../../bizcomponents/SearchCohort/index'
import { Person } from '@/module/org';
import { sleep } from '@/store/sleep';
import type { ProFormColumnsType } from '@ant-design/pro-components';

type DataItem = {
  name: string;
  state: string;
};
/**
 * 个人信息
 * @returns
 */
const CohortConfig: React.FC = () => {
  const service = new CohortService({
    nameSpace: 'myCohort',
    searchApi: API.cohort.getJoinedCohorts,
    createApi: API.cohort.create,
    updateApi: API.cohort.update
  });

  const [list, setList] = useState<CohortConfigType.CohortConfigTeam[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const { user } = useStore((state) => ({ ...state }));
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<CohortConfigType.CohortConfigTeam>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friend, setFriend] = useState<Person>()
 
  useEffect(() => {
    getTableList();
  }, []);
  const renderOperation = (
    item: CohortConfigType.CohortConfigTeam,
  ): CohortConfigType.OperationType[] => {
    return [
      {
        key: 'enterChat',
        label: '进入会话',
        onClick: () => {
          console.log('按钮事件', 'enterChat', item);
        },
      },
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          showModal()
          setItem(item)
          console.log('按钮事件', 'inviteMembers', item);
        },
      },
      {
        key: 'updateCohort',
        label: '修改群组',
        onClick: () => {
          
          setItem(item)
          setOpen(true);
          console.log('按钮事件1231', 'updateCohort', item);
        },
      },
      {
        key: 'roleManage',
        label: '角色管理',
        onClick: () => {
          console.log('按钮事件', 'roleManage', item);
        },
      },
      {
        key: 'identityManage',
        label: '身份管理',
        onClick: () => {
          console.log('按钮事件', 'identityManage', 
          );
        },
      },
      {
        key: 'changePermission',
        label: '转移权限',
        onClick: () => {
          console.log('按钮事件', 'changePermission', item);
        },
      },
      {
        key: 'breakCohort',
        label: '解散群组',
        onClick: () => {
          console.log('按钮事件', 'breakCohort', item);
        },
      },
    ];
  };
  /**
   * @desc: 获取展示列表
   * @param {string} searchKey 搜索关键词
   * @param {boolean} isGofirst 是否返回第一页
   * @return {*}
   */
  const getTableList = async (req = {}, searchKey = '', isGofirst = false) => {
    if (isGofirst) {
      setPage(1);
    }
    if (!service.PUBLIC_STORE.id) {
      // 防止页面刷新时,数据请求缓慢造成数据缺失问题
      await sleep(100);
    }

    const params = {
      id: service.PUBLIC_STORE.id,
      page: isGofirst ? 1 : page,
      pageSize: 10,
      filter: searchKey,
    };
    await service.getList({ ...params, ...req });
    let resultList: Array<CohortConfigType.CohortConfigTeam> = [];
    console.log("获取值", service.List)
    for (var i = 0; i < service.List.length; i++) {
      if (service.List[i].belongId === { user }.user.workspaceId) {
        const chorot: CohortConfigType.CohortConfigTeam = service.List[i].team
        chorot.belongId = service.List[i].belongId
        chorot.thingId = service.List[i].thingId
        resultList.push(chorot)
      }
    }
    setList([...resultList]);
    console.log(66, resultList, resultList.length)
    setTotal(resultList.length);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    getTableList({ page, pageSize });
  };


  const tableAlertRender = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys)
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };


  const handleOk = async () => {
    setIsModalOpen(false);
    const { data, code } = await service.getpullPerson({
      id: item?.id,
      targetIds: [friend?.id]
    });
    if (code === 200) {
      message.success('邀请成功');
    } else {
      message.warning('您不是群管理员');
    }
  };
  const handleCancle = () => {
    setIsModalOpen(false);
  };
  const searchCallback = (person: Person) => {
    setFriend(person);
  };
  return (

    <div className={cls['person-info-content-container']}>
      <div>
        <PersonInfo />
      </div>
      <Card>
        <div className={cls['person-info-content-header']}>
          <Title level={2}>
            <strong>群组</strong>
          </Title>
          <div style={{ float: "right" }}>
            <Space split={<Divider type="vertical" />}>
              <Modal title="邀请成员" open={isModalOpen} onOk={handleOk} onCancel={handleCancle} width='1050px'>
                <Persons searchCallback={searchCallback} />
              </Modal>
              <Modal title="加入群组" open={isModalOpen} onOk={handleOk} onCancel={handleCancle} width='1050px' >
                <AddCohort searchCallback={searchCallback} />
              </Modal>
              <UpdateCohort
              key={item?.id}
               layoutType="ModalForm"
                title="修改群组"
                modalProps={{
                  destroyOnClose: true,
                  onCancel: () => setOpen(false),
                }} service={service} open={open} columns = {service.getcolumn()} setOpen={setOpen} item={item} getTableList={getTableList} />
              <CreateCohort service={service} getTableList={getTableList} />
              <Button type="link" onClick = {showModal}>加入群组</Button>
            </Space>
          </div>
        </div>
        <Tabs
          // style = {}
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `管理的`,
              key: '1',
              children: <CardOrTable<CohortConfigType.CohortConfigTeam>
                dataSource={list}
                total={total}
                page={page}
                tableAlertRender={tableAlertRender}
                rowSelection={{
                  // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                  // 注释该行则默认不显示下拉选项
                  // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                  // defaultSelectedRowKeys: [1],
                }}
                // defaultPageType={'table'}
                showChangeBtn={false}
                operation={renderOperation}
                columns={cohortColumn as any}
                // style={divStyle}
                onChange={handlePageChange}
                rowKey={'id'}
              />,
            },
            {
              label: `加入的`,
              key: '2',
              children: `Content of Tab Pane 2`,
            },

          ]}
        />
      </Card>

    </div>

  );

};

export default CohortConfig;
