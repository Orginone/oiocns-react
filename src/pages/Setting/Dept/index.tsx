import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, message, Modal, Tabs } from 'antd';
import { columns } from './config';
import Title from 'antd/lib/typography/Title';
import { MarketTypes } from 'typings/marketType';
import type * as schema from '@/ts/base/schema';
import TreeLeftDeptPage from './components/TreeLeftDeptPage';
import SettingService from './service';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { RouteComponentProps } from 'react-router-dom';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import EditCustomModal from './components/EditCustomModal';
import TransferDepartment from './components/TransferDepartment';
import DeptDescription from './components/DeptDescription';
import LookApply from './components/LookApply';
import { IDepartment } from '@/ts/core/target/itarget';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SearchPerson from '@/bizcomponents/SearchPerson';
import cls from './index.module.less';
import IndentityManage from '../../../bizcomponents/Indentity';

/**
 * 内设机构
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps> = ({ history }) => {
  const setting = SettingService.getInstance();
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加成员
  const [isSetPost, setIsSetPost] = useState<boolean>(false); // 岗位设置
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>();
  const [createOrEdit, setCreateOrEdit] = useState<string>('新增');
  const [Transfer, setTransfer] = useState<boolean>(false); //变更部门
  const [dataSource, setDataSource] = useState<schema.XTarget[]>([]); //部门成员
  const [SelectDept, setSelectDept] = useState<IDepartment>(); // 左侧树选中的当前部门对象
  const [selectPerson, setSelectPerson] = useState<schema.XTarget>(); // 当前要拉的人
  const [editDept, setEditDept] = useState<IDepartment>();
  const [isIndentityOpen, setIsIndentityOpen] = useState<boolean>(false);
  const [authorityTree, setAuthorityTree] = useState<IAuthority>();
  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): MarketTypes.OperationType[] => {
    return [
      {
        key: 'publish',
        label: '修改信息',
        onClick: () => {
          console.log('按钮事件', 'publish', item);
        },
      },
      {
        key: 'changeDept',
        label: '变更部门',
        onClick: () => {
          // console.log('按钮事件', 'share', item);
          setTransfer(true);
        },
      },
      {
        key: 'caption',
        label: '停用',
        onClick: () => {
          console.log('按钮事件', 'publishList', item);
        },
      },
      {
        key: 'caption1',
        label: '移出部门',
        onClick: async () => {
          if (selectPerson && SelectDept) {
            const { success } = await SelectDept.removePerson([item.id]);
            if (success) {
              message.success('添加成功');
              userCtrl.changCallback();
              setIsAddOpen(false);
            }
          }
          console.log('按钮事件', 'publishList', item);
        },
      },
    ];
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: IDepartment | undefined, pid?: string) => {
    switch (key) {
      case 'new':
        setting.setCurrTreeDeptNode('');
        setEditDept(undefined);
        setCreateOrEdit('新增');
        setIsOpenModal(true);
        break;
      case '新增部门':
        if (!item) return;
        setEditDept(item);
        setCreateOrEdit('新增');
        setSelectId(item.target.id);
        setting.setCurrTreeDeptNode(item.target.id);
        setIsOpenModal(true);
        break;
      case 'changeDept': //变更部门
        break;
      case 'updateDept': // 编辑部门
        if (!item) return;
        setCreateOrEdit('编辑');
        setEditDept(item);
        setSelectId(item.target.id);
        setting.setCurrTreeDeptNode(item.target.id);
        setIsOpenModal(true);
        break;
      case '删除部门':
        Modal.confirm({
          title: '提示',
          icon: <ExclamationCircleOutlined />,
          content: '是否确定删除该群组',
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            if (pid) {
              const parent = await setting.refItem(pid);
              let result = null;
              if (parent) {
                result = await parent.deleteDepartment(
                  item.target.id,
                  userCtrl.Company.target.id,
                );
              } else {
                result = await userCtrl.Company.deleteDepartment(item.target.id);
              }
              if (result.success) {
                message.success('删除成功');
                userCtrl.changCallback();
              } else {
                message.success('删除失败');
              }
            }
          },
        });
    }
  };

  // 选中树的时候操作
  const setTreeCurrent = (current: IDepartment) => {
    setSelectDept(current);
    setSelectId(current.target.id);
    setting.setCurrTreeDeptNode(current.target.id);
    current.getPerson(false).then((e) => {
      setDataSource(e);
    });
    current.selectAuthorityTree(false).then((auths) => {
      if (auths) {
        setAuthorityTree(auths);
      }
    });
  };
  const onApplyOk = () => {
    setLookApplyOpen(false);
  };

  const onOk = () => {
    setIsAddOpen(false);
    setIsSetPost(false);
    setTransfer(false);
    setLookApplyOpen(false);
    setIsOpenModal(false);
  };
  const handleOk = () => {
    setIsAddOpen(false);
    setIsSetPost(false);
    setTransfer(false);
    setLookApplyOpen(false);
    setIsOpenModal(false);
    // 处理刷新的功能
    userCtrl.changCallback();
  };
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {
    if (!userCtrl.IsCompanySpace) {
      history.push('/setting/info', { refresh: true });
    } else {
      // 刚进入的时候选中公司 TODO
      setting.setCompanyID = userCtrl?.Company?.target.id + '';
      setting.setRoot = userCtrl?.Company!.target;
    }
  }, ['', userCtrl?.Company]);

  useEffect(() => {
    setting.setCompanyID = userCtrl?.Company?.target.id ?? '';
  }, [selectId]);

  // 标题tabs页
  const TitleItems = [
    {
      tab: `部门成员`,
      key: 'deptPerpeos',
    },
    {
      tab: `部门应用`,
      key: 'deptApps',
    },
  ];

  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button
          type="link"
          onClick={() => {
            setIsIndentityOpen(true);
          }}>
          岗位设置
        </Button>
        <Button type="link" onClick={() => setIsAddOpen(true)}>
          添加成员
        </Button>
        <Button type="link" onClick={() => history.push('/todo/org')}>
          查看申请
        </Button>
      </Space>
    );
  };
  //部门主体
  const deptCount = (
    <div className={cls['pages-wrap']}>
      <PageCard
        bordered={false}
        tabList={TitleItems}
        onTabChange={(key) => {}}
        bodyStyle={{ paddingTop: 16 }}>
        <div className={cls['page-content-table']} ref={parentRef}>
          <Tabs items={[{ label: `全部`, key: '1' }]} tabBarExtraContent={renderBtns()} />
          <CardOrTable<schema.XTarget>
            dataSource={dataSource}
            rowKey={'id'}
            operation={renderOperation}
            columns={columns}
            parentRef={parentRef}
            showChangeBtn={false}
          />
        </div>
      </PageCard>
    </div>
  );

  return (
    <div className={cls[`dept-content-box`]}>
      <DeptDescription
        title={<Title level={4}>部门信息</Title>}
        selectDept={SelectDept?.target}
        extra={[
          <Button
            key="edit"
            type="link"
            onClick={() => handleMenuClick('updateDept', SelectDept)}>
            编辑
          </Button>,
          <Button type="link" key="qx" onClick={() => setIsSetPost(true)}>
            权限管理
          </Button>,
        ]}
      />
      {deptCount}
      {/* 编辑部门 */}
      <EditCustomModal
        handleCancel={() => setIsOpenModal(false)}
        editDept={editDept}
        open={isOpenModal}
        title={createOrEdit}
        handleOk={handleOk}
      />
      <IndentityManage
        open={isIndentityOpen}
        object={SelectDept!}
        MemberData={dataSource}
        onCancel={() => {
          setIsIndentityOpen(false);
        }}
      />
      {/* 添加成员*/}
      <Modal
        title="添加成员"
        destroyOnClose
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        onOk={async () => {
          if (selectPerson && SelectDept) {
            const { success } = await SelectDept.pullPerson([selectPerson]);
            if (success) {
              message.success('添加成功');
              userCtrl.changCallback();
              setIsAddOpen(false);
            }
          }
        }}>
        <SearchPerson searchCallback={setSelectPerson} />
      </Modal>
      {/* 添加成员
      <AddPersonModal
        title={'添加成员'}
        open={isAddOpen}
        onOk={onPersonalOk}
        handleOk={handleOk}
      /> */}
      {/* 查看申请 */}
      <LookApply
        title={'查看申请'}
        open={isLookApplyOpen}
        onOk={onApplyOk}
        handleOk={handleOk}
      />
      {/* 变更部门 */}
      <TransferDepartment
        title={'转移部门'}
        open={Transfer}
        onOk={onOk}
        handleOk={handleOk}
      />
      {/* 对象设置 */}
      {authorityTree && (
        <AddPostModal
          title={'权限设置'}
          open={isSetPost}
          onOk={() => {
            setIsSetPost(false);
          }}
          handleOk={() => {
            setIsSetPost(false);
          }}
          datasource={authorityTree}
        />
      )}
      {/* 左侧树 */}
      <TreeLeftDeptPage
        setCurrent={setTreeCurrent}
        handleMenuClick={handleMenuClick}
        currentKey={''}
      />
    </div>
  );
};

export default SettingDept;
