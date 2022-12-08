import React, { useState, useRef } from 'react';
import { Button, message, Modal, Tabs, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';
import { common } from 'typings/common';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import IndentityManage from '@/bizcomponents/Indentity';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import EditCustomModal from './components/EditCustomModal';
import TransferDepartment from './components/TransferDepartment';
import DepartTree from './components/TreeLeftDeptPage';
import DeptDescription from './components/DeptDescription';
import { columns } from './config';
import cls from './index.module.less';

interface ICanDelete {
  delete(): Promise<boolean>;
}

type ShowmodelType = 'addOne' | 'edit' | 'post' | 'transfer' | 'indentity' | '';
/**
 * 内设机构
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps> = ({ history }) => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [current, setCurrent] = useState<ITarget>();
  const [edit, setEdit] = useState<ITarget>();
  const [activeModal, setActiveModal] = useState<ShowmodelType>(''); // 模态框
  const [createOrEdit, setCreateOrEdit] = useState<string>('新增'); // 编辑或新增部门模态框标题
  const [selectPerson, setSelectPerson] = useState<XTarget>(); // 选中的要拉的人
  // 操作内容渲染函数
  const renderOperation = (item: XTarget): common.OperationType[] => {
    return [
      {
        key: 'changeDept',
        label: '变更部门',
        onClick: () => {
          setSelectPerson([item]);
          setActiveModal('transfer');
        },
      },
      {
        key: 'moveOne',
        label: '移出部门',
        onClick: async () => {
          if (selectPerson && current) {
            if (await current.removeMember(item)) {
              message.success('移出成功');
              userCtrl.changCallback();
            }
          }
        },
      },
    ];
  };
  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: ITarget | undefined) => {
    switch (key) {
      case 'new':
        setEdit(undefined);
        setCreateOrEdit('新增');
        setActiveModal('edit');
        break;
      case '新增部门':
        if (!item) return;
        setEdit(item);
        setCreateOrEdit('新增');
        setActiveModal('edit');
        break;
      case 'changeDept': //变更部门
        setActiveModal('transfer');
        break;
      case 'updateDept': // 编辑部门
        if (!item) return;
        setCreateOrEdit('编辑');
        setEdit(item);
        setActiveModal('edit');
        break;
      case '删除部门':
        if (!item) return;
        Modal.confirm({
          title: '提示',
          icon: <ExclamationCircleOutlined />,
          content: `是否确定删除${item.target.name}?`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const idelete = item as unknown as ICanDelete;
            if (idelete && (await idelete.delete())) {
              message.success(`删除${item.target.name}成功!`);
              userCtrl.changCallback();
            } else {
              message.error(`删除${item.target.name}失败!`);
            }
          },
        });
    }
  };
  const handleOk = () => {
    setActiveModal('');
    // 处理刷新的功能
    userCtrl.changCallback();
  };

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
      <>
        <Button type="link" onClick={() => setActiveModal('indentity')}>
          身份设置
        </Button>
        <Button type="link" onClick={() => setActiveModal('addOne')}>
          添加成员
        </Button>
        <Button type="link" onClick={() => history.push('/todo/org')}>
          查看申请
        </Button>
      </>
    );
  };

  return (
    <div className={cls[`dept-content-box`]}>
      {current ? (
        <>
          <DeptDescription
            title={<Typography.Title level={5}>部门信息</Typography.Title>}
            selectDept={current.target}
            extra={[
              <Button
                key="edit"
                type="link"
                onClick={() => handleMenuClick('updateDept', current)}>
                编辑
              </Button>,
              <Button type="link" key="qx" onClick={() => setActiveModal('post')}>
                权限管理
              </Button>,
            ]}
          />
          <div className={cls['pages-wrap']}>
            <PageCard
              bordered={false}
              tabList={TitleItems}
              onTabChange={(key) => {}}
              bodyStyle={{ paddingTop: 16 }}>
              <div className={cls['page-content-table']} ref={parentRef}>
                <Tabs
                  items={[{ label: `全部`, key: '1' }]}
                  tabBarExtraContent={renderBtns()}
                />
                <CardOrTable<XTarget>
                  dataSource={deptMembers}
                  rowKey={'id'}
                  operation={renderOperation}
                  columns={columns}
                  parentRef={parentRef}
                  showChangeBtn={false}
                />
              </div>
            </PageCard>
          </div>
          {/* 编辑部门 */}
          <EditCustomModal
            handleCancel={() => setActiveModal('')}
            current={edit || userCtrl.company}
            open={activeModal === 'edit'}
            title={createOrEdit}
            handleOk={handleOk}
          />
          <IndentityManage
            open={activeModal === 'indentity'}
            current={current}
            onCancel={() => setActiveModal('')}
          />
          {/* 添加成员*/}
          <Modal
            title="添加成员"
            destroyOnClose
            open={activeModal === 'addOne'}
            onCancel={() => setActiveModal('')}
            onOk={async () => {
              if (selectPerson) {
                if (await current.pullMember(selectPerson)) {
                  message.success('添加成功');
                  handleOk();
                }
              }
            }}>
            <SearchPerson searchCallback={setSelectPerson} />
          </Modal>
          {/* 变更部门 */}
          <TransferDepartment
            title={'转移部门'}
            open={activeModal === 'transfer'}
            handleOk={handleOk}
            onCancel={() => setActiveModal('')}
            current={current}
            needTransferUser={selectPerson!}
          />
          {/* 对象设置 */}
          <AddPostModal
            title={'权限设置'}
            open={activeModal === 'post'}
            handleOk={handleOk}
            current={current}
          />
        </>
      ) : (
        ''
      )}
      {/* 左侧树 */}
      <DepartTree
        current={current}
        handleMenuClick={handleMenuClick}
        setCurrent={(item) => setCurrent(item)}
      />
    </div>
  );
};

export default SettingDept;
