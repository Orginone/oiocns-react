import React, { useState, useRef } from 'react';
import { Button, message, Modal, Tabs, Typography } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { common } from 'typings/common';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import TransferDepartment from './components/TransferDepartment';
import GroupTree from './components/TreeLeftDeptPage';
import Description from './components/Description';
import { columns } from './config';
import cls from './index.module.less';
import SearchPerson from '@/bizcomponents/SearchPerson';
import CreateTeamModal from '@/bizcomponents/CreateTeam';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';

interface ICanDelete {
  delete(): Promise<boolean>;
}
/**
 * 内设机构
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps> = ({ history }) => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [current, setCurrent] = useState<ITarget>();
  const [edit, setEdit] = useState<ITarget>();
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [createOrEdit, setCreateOrEdit] = useState<string>('新增'); // 编辑或新增部门模态框标题
  const [selectPerson, setSelectPerson] = useState<XTarget>(); // 选中的要拉的人
  const [key, forceUpdate] = useCtrlUpdate(userCtrl, () => {
    setCurrent(undefined);
  });
  // 操作内容渲染函数
  const renderOperation = (item: XTarget): common.OperationType[] => {
    return [
      {
        key: 'changeDept',
        label: '变更' + item.typeName,
        onClick: () => {
          setSelectPerson(item);
          setActiveModal('transfer');
        },
      },
      {
        key: 'moveOne',
        label: '移出' + item.typeName,
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
  const handleMenuClick = async (key: string, item: ITarget | undefined) => {
    if (key.startsWith('新建')) {
      setEdit(item);
      setCreateOrEdit(key.substring(3));
      setActiveModal('新建');
    } else if (item) {
      switch (key) {
        case '刷新':
          await item.loadSubTeam(true);
          forceUpdate();
          break;
        case '删除':
          if (item as unknown as ICanDelete) {
            if (await (item as unknown as ICanDelete).delete()) {
              setCurrent(undefined);
              forceUpdate();
            }
          }
          break;
        case 'changeDept': //变更部门
          setActiveModal('transfer');
          break;
        case '编辑': // 编辑部门
          if (!item) return;
          setCreateOrEdit(item.target.typeName);
          setEdit(item);
          setActiveModal('编辑');
          break;
      }
    }
  };

  const handleOk = () => {
    setActiveModal('');
    forceUpdate();
  };

  // 标题tabs页
  const TitleItems = [
    {
      tab: current?.target.typeName ?? '机构' + `成员`,
      key: 'deptPerpeos',
    },
    {
      tab: `集团应用`,
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
      <CreateTeamModal
        title={activeModal}
        open={['新建', '编辑'].includes(activeModal)}
        handleCancel={function (): void {
          setActiveModal('');
        }}
        handleOk={(newItem) => {
          if (newItem) {
            forceUpdate();
            setActiveModal('');
          }
        }}
        current={edit || userCtrl.company}
        typeNames={createOrEdit.split('|')}
      />
      {current ? (
        <>
          <Description
            title={
              <Typography.Title level={5}>{current.target.typeName}信息</Typography.Title>
            }
            selectDept={current.target}
            extra={[
              <Button
                key="edit"
                type="link"
                onClick={() => handleMenuClick('编辑', current)}>
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
                  rowKey={'id'}
                  params={current}
                  request={async (page) => {
                    return await current.loadMembers(page);
                  }}
                  operation={renderOperation}
                  columns={columns}
                  parentRef={parentRef}
                  showChangeBtn={false}
                  dataSource={[]}
                />
              </div>
            </PageCard>
          </div>
          {/* 编辑部门 */}
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
      <GroupTree
        key={key}
        current={current}
        handleMenuClick={handleMenuClick}
        setCurrent={(item) => setCurrent(item)}
      />
    </div>
  );
};

export default SettingDept;
