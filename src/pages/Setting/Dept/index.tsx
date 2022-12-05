/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Space, message, Modal } from 'antd';
import { columns } from './config';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import { MarketTypes } from 'typings/marketType';
import type * as schema from '@/ts/base/schema';
import TreeLeftDeptPage from './components/TreeLeftDeptPage';
import { initDatatype } from '@/ts/core/setting/isetting';
import SettingService from './service';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { RouteComponentProps } from 'react-router-dom';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import EditCustomModal from './components/EditCustomModal';
import AddPersonModal from './components/AddPersonModal';
import TransferDepartment from './components/TransferDepartment';
import DeptDescription from './components/DeptDescription';
import LookApply from './components/LookApply';
import { IDepartment } from '@/ts/core/target/itarget';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Company from '@/ts/core/target/company';
// import { IDepartment } from '@/ts/core/target/itarget';

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
  const [editDept, setEditDept] = useState<IDepartment>();
  const [authorityTree, setAuthorityTree] = useState<IAuthority>();

  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
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
        key: 'detail',
        label: '岗位设置',
        onClick: () => {
          setIsSetPost(true);
          // console.log('按钮事件', 'detail', item);
        },
      },
      {
        key: 'publishList',
        label: '内设机构',
        onClick: () => {
          console.log('按钮事件', 'publishList', item);
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
        onClick: () => {
          console.log('按钮事件', 'publishList', item);
        },
      },
    ];
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: IDepartment | undefined, pid?: string) => {
    if (!item) return;
    switch (key) {
      case 'new':
        setting.setCurrTreeDeptNode('');
        setEditDept(undefined);
        setCreateOrEdit('新增');
        setIsOpenModal(true);
        break;
      case '新增部门':
        setEditDept(item);
        setCreateOrEdit('新增');
        setSelectId(item.target.id);
        setting.setCurrTreeDeptNode(item.target.id);
        setIsOpenModal(true);
        break;
      case 'changeDept': //变更部门
        break;
      case 'updateDept': // 编辑部门
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
              if (parent) {
                const { success } = await parent.deleteDepartment(
                  item.target.id,
                  userCtrl.Company.target.id,
                );
                success ? message.success('删除成功') : message.success('删除失败');
              } else {
                userCtrl.Company.deleteDepartment(item.target.id);
              }
              message.success('解散成功');
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
    // const dept = new Department(current);
    current.getPerson(false).then((e) => {
      setDataSource(e);
    });
    current.selectAuthorityTree(false).then((auths) => {
      if (auths) {
        setAuthorityTree(auths);
      }
    });
  };

  /** 添加人员的逻辑 */
  const onPersonalOk = (params: initDatatype[]) => {
    console.log(params);
    setIsAddOpen(false);
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
    // userCtrl.changCallback();
  };
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {
    if (!userCtrl.IsCompanySpace) {
      history.push('/setting/info', { refresh: true });
    } else {
      initData();
      // 刚进入的时候选中公司 TODO
      setting.setCompanyID = userCtrl?.Company?.target.id + '';
      setting.setRoot = userCtrl?.Company!.target;
    }
  }, ['', userCtrl?.Company]);

  useEffect(() => {
    setting.setCompanyID = userCtrl?.Company?.target.id ?? '';
  }, [selectId]);

  const initData = async () => {};

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

  // tabs页
  const items = [
    {
      tab: `全部`,
      key: '1',
    },
  ];

  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button
          type="link"
          onClick={() => {
            if (authorityTree) {
              setIsSetPost(true);
            }
          }}>
          身份设置
        </Button>
        <Button
          type="link"
          onClick={() => {
            setIsAddOpen(true);
          }}>
          添加成员
        </Button>
        <Button
          type="link"
          onClick={() => {
            setLookApplyOpen(true);
          }}>
          查看申请
        </Button>
      </Space>
    );
  };
  //部门主体
  const deptCount = (
    // <div className={`${cls['dept-wrap-pages']}`}>
    <PageCard tabList={TitleItems}>
      {/* <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}> */}
      <Card
        title={userCtrl?.Company?.target?.name}
        className={cls['app-tabs']}
        extra={renderBtns()}
        tabList={items}
        onTabChange={(key) => {
          console.log('切换事件', key);
        }}>
        <div className={cls['page-content-table']} ref={parentRef}>
          <CardOrTable
            dataSource={dataSource as any}
            rowKey={'id'}
            operation={renderOperation}
            columns={columns as any}
            parentRef={parentRef}
            showChangeBtn={false}
          />
        </div>
      </Card>
      {/* </div> */}
    </PageCard>
    // </div>
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
            onClick={() => {
              handleMenuClick('updateDept', SelectDept);
            }}>
            编辑
          </Button>,
          <Button type="link" key="qx">
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
        onOk={onOk}
        handleOk={handleOk}
      />
      {/* 添加成员 */}
      <AddPersonModal
        title={'添加成员'}
        open={isAddOpen}
        onOk={onPersonalOk}
        handleOk={handleOk}
      />
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
      <AddPostModal
        title={'身份设置'}
        open={isSetPost}
        onOk={() => {
          setIsSetPost(false);
        }}
        handleOk={() => {
          setIsSetPost(false);
        }}
        datasource={authorityTree}
      />
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
