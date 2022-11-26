import { Button, Space, Tabs, Card, Modal, message } from 'antd';
import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState, useEffect } from 'react';
import PersonInfo from '../../../bizcomponents/PersonInfo/index';
import CardOrTable from '@/components/CardOrTableComp';
import { CohortConfigType } from 'typings/Cohort';
import { cohortColumn } from '@/components/CardOrTableComp/config';
import cls from './index.module.less';
import CohortService from '@/module/cohort/Cohort';
import UpdateCohort from '@/bizcomponents/Cohort/UpdateCohort/index';
import Persons from '../../../bizcomponents/SearchPerson/index';
import AddCohort from '../../../bizcomponents/SearchCohort/index';
import { Person } from '@/module/org';
import { Cohort } from '../../../module/org/index';
import { useHistory } from 'react-router-dom';
import PersonInfoEnty from '../../../ts/core/provider';
import CohortEnty from '../../../ts/core/target/cohort';
import CohortController from '../../../ts/controller/cohort/index';
import ChangeCohort from './SearchCohortPerson/index';
import CreateCohort from '../../../bizcomponents/Cohort/index';
import { schema } from '../../../ts/base';
/**
 * 个人信息
 * @returns
 */
const CohortConfig: React.FC = () => {
  const service = new CohortService({
    nameSpace: 'myCohort',
  });
  const Person = PersonInfoEnty.getPerson!;
  console.log('实体信息', Person);
  // console.log('workSpaceId', PersonInfoEnty.getWorkSpace());
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<CohortEnty>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addIsModalOpen, setAddIsModalOpen] = useState(false);
  const [changeIsModelOpen, setChangeIsModelOpen] = useState(false);
  const history = useHistory();
  const [friend, setFriend] = useState<schema.XTarget>();
  const [cohort, setcohort] = useState<Cohort>();
  const [data, setData] = useState<CohortEnty[]>();
  const [joinData, setJoinData] = useState<CohortEnty[]>();

  useEffect(() => {
    CohortController.setCallBack(setData);
    CohortController.setJoinCallBack(setJoinData);
    getData();
    getJoinData();
  }, []);
  useEffect(() => {
    console.log('发生变化');
  }, [data]);
  const getData = async () => {
    setData(await CohortController.getMyCohort());
  };
  const getJoinData = async () => {
    setJoinData(await CohortController.getJoinCohort());
  };

  const renderOperation = (item: CohortEnty): CohortConfigType.OperationType[] => {
    return [
      {
        key: 'enterChat',
        label: '进入会话',
        onClick: () => {
          history.push('/chat');
          console.log('按钮事件', 'enterChat', item);
        },
      },
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          showModal();
          setItem(item);
          console.log('按钮事件', 'inviteMembers', item);
        },
      },
      {
        key: 'updateCohort',
        label: '修改群组',
        onClick: () => {
          setItem(item);
          setOpen(true);
          console.log('按钮事件', 'updateCohort', item);
        },
      },
      {
        key: 'roleManage',
        label: '角色管理',
        onClick: () => {
          history.push({ pathname: '/person/Role', state: { cohortId: item.target.id } });
          console.log('按钮事件', 'roleManage', item);
        },
      },
      {
        key: 'identityManage',
        label: '身份管理',
        onClick: () => {
          console.log('按钮事件', 'identityManage');
        },
      },
      {
        key: 'changePermission',
        label: '转移权限',
        onClick: () => {
          setItem(item);
          setChangeIsModelOpen(true);
          console.log('按钮事件', 'changePermission', item);
        },
      },
      {
        key: 'breakCohort',
        label: '解散群组',
        onClick: () => {
          console.log(CohortController.deleteCohort(Person, item.target.id));
          // newCohortServices.deleteCohort(param);
          message.info('解散成功');
          // getTableList();
        },
      },
    ];
  };
  const joinrenderOperation = (item: CohortEnty): CohortConfigType.OperationType[] => {
    return [
      {
        key: 'inviteMembers',
        label: '邀请成员',
        onClick: () => {
          showModal();
          setItem(item);
          console.log('按钮事件', 'inviteMembers', item);
        },
      },
      {
        key: 'exitCohort',
        label: '退出群聊',
        onClick: () => {
          CohortController.quitCohort(Person, item.target.id);
          message.info('退出成功');
          console.log('按钮事件', 'exitCohort', item);
        },
      },
    ];
  };
  const getTableList = async (req = {}, searchKey = '', isGofirst = false) => {};

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    getTableList({ page, pageSize });
  };

  const tableAlertRender = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys);
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  //转移权限确认事件
  const changeHandleOk = async () => {
    setChangeIsModelOpen(false);
    console.log(
      CohortController.updateCohort(
        item!,
        item?.target.name!,
        item?.target.code!,
        item?.target.team?.remark!,
        friend?.id!,
      ),
    );
    console.log('获取到选中对象', friend);
  };
  //邀请成员确认事件
  const handleOk = async () => {
    setIsModalOpen(false);
    const res = CohortController.pullCohort(item!, [friend!]);
    if ((await res).success) {
      console.log(res);
      message.success('邀请成功');
    } else {
      message.error((await res).msg);
    }
  };
  //申请加入群组确认事件
  const cohortHandleOk = async () => {
    const data = await CohortController.joinCohort(Person, cohort?.id ? cohort.id : '');
    if (!data.success) {
      message.error(data.msg);
    } else message.info('申请加入成功');
    setAddIsModalOpen(false);
  };

  const searchCallback = (person: schema.XTarget) => {
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
          <div style={{ float: 'right' }}>
            <Space split={<Divider type="vertical" />}>
              <Modal
                title="转移权限"
                open={changeIsModelOpen}
                onOk={changeHandleOk}
                onCancel={() => setChangeIsModelOpen(false)}
                width="1050px">
                <ChangeCohort cohort={item!} searchCallback={searchCallback} />
              </Modal>

              <Modal
                title="邀请成员"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width="1050px">
                <Persons searchCallback={searchCallback} person={Person} />
              </Modal>

              <Modal
                title="加入群组"
                open={addIsModalOpen}
                onOk={cohortHandleOk}
                onCancel={() => setAddIsModalOpen(false)}
                width="1050px">
                <AddCohort person={Person} setCohort={setcohort} />
              </Modal>
              {item && (
                <UpdateCohort
                  key={item?.target.id}
                  layoutType="ModalForm"
                  title="修改群组"
                  modalProps={{
                    destroyOnClose: true,
                    onCancel: () => setOpen(false),
                  }}
                  open={open}
                  columns={service.getcolumn()}
                  setOpen={setOpen}
                  item={item}
                  getTableList={getTableList}
                />
              )}

              <CreateCohort
                Person={Person}
                service={service}
                getTableList={getTableList}
              />
              <Button type="link" onClick={() => setAddIsModalOpen(true)}>
                加入群组
              </Button>
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
              children: (
                <CardOrTable<CohortEnty>
                  dataSource={data!}
                  total={total}
                  page={page}
                  tableAlertRender={tableAlertRender}
                  rowSelection={
                    {
                      // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                      // 注释该行则默认不显示下拉选项
                      // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                      // defaultSelectedRowKeys: [1],
                    }
                  }
                  // defaultPageType={'table'}
                  showChangeBtn={false}
                  operation={renderOperation}
                  columns={cohortColumn as any}
                  // style={divStyle}
                  onChange={handlePageChange}
                  rowKey={'id'}
                />
              ),
            },
            {
              label: `加入的`,
              key: '2',
              children: (
                <CardOrTable<CohortEnty>
                  dataSource={joinData!}
                  total={total}
                  page={page}
                  tableAlertRender={tableAlertRender}
                  rowSelection={
                    {
                      // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                      // 注释该行则默认不显示下拉选项
                      // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                      // defaultSelectedRowKeys: [1],
                    }
                  }
                  // defaultPageType={'table'}
                  showChangeBtn={false}
                  operation={joinrenderOperation}
                  columns={cohortColumn as any}
                  // style={divStyle}
                  onChange={handlePageChange}
                  rowKey={'id'}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default CohortConfig;
