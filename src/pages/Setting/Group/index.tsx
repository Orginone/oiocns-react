import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Tabs, Typography } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { common } from 'typings/common';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IGroup, ITarget, TargetType } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import TransferDepartment from './components/TransferDepartment';
import GroupTree from './components/TreeLeftDeptPage';
import GroupDescription from './components/Description';
import { columns } from './config';
import cls from './index.module.less';
// import SearchPerson from '@/bizcomponents/SearchPerson';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SearchCompany from '@/bizcomponents/SearchCompany';
import AssignPosts from '@/bizcomponents/AssignPostCompany';
import useObjectUpdate from '@/hooks/useObjectUpdate';

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
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [isTopGroup, setTopGroup] = useState<boolean>(); // 是否是一级集团
  const [getTopGroup, setGetTopGroup] = useState<IGroup>(); // 二级三级集团反查一级集团
  const [edit, setEdit] = useState<ITarget>();
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [createOrEdit, setCreateOrEdit] = useState<string>('新增'); // 编辑或新增集团模态框标题
  const [selectPerson, setSelectPerson] = useState<XTarget[]>([]); // 选中的要拉的人
  const [key, forceUpdate] = useCtrlUpdate(userCtrl, () => {
    setCurrent(undefined);
  });

  useEffect(() => {
    if (current) {
      isTop(current.id).then(async (isBoolean) => {
        // 判断是否是一级部门
        setTopGroup(isBoolean);
        if (!isBoolean) {
          // 如果是二级部门，反向查询获取一级部门
          const groups = await userCtrl.company.getJoinedGroups(false);
          for (const group of groups) {
            const findGroup = _search(group, current.id);
            if (findGroup) {
              setGetTopGroup(group);
            }
          }
        }
      });
    }
  }, [current]);
  // 操作内容渲染函数
  const renderOperation = (item: XTarget): common.OperationType[] => {
    return [
      {
        key: 'moveOne',
        label: '移出' + item.typeName,
        onClick: async () => {
          if (current) {
            if (await current.removeMember(item)) {
              tforceUpdate();
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
        case 'changeDept': //变更集团
          setActiveModal('transfer');
          break;
        case '编辑': // 编辑集团
          if (!item) return;
          setCreateOrEdit(item.target.typeName);
          setEdit(item);
          setActiveModal('编辑');
          break;
      }
    }
  };

  const _search = (item: IGroup, key: string): IGroup | undefined => {
    if (item.id === key) {
      return item;
    }
    for (const i of item.subGroup) {
      const res = _search(i, key);
      if (res) {
        return res;
      }
    }
  };

  // 判断是否是一级部门
  const isTop = async (groupid: string) => {
    let isTop: boolean = false;
    const groups = await userCtrl.company.getJoinedGroups(false);
    for (const group of groups) {
      if (group.id == groupid) {
        isTop = true;
        break;
      }
    }
    return isTop;
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
          <GroupDescription
            title={
              <Typography.Title level={5}>{current.target.typeName}信息</Typography.Title>
            }
            selectGroup={current}
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
                  params={tkey}
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
          {/* 身份设置 */}
          <IndentityManage
            open={activeModal === 'indentity'}
            current={current}
            onCancel={() => setActiveModal('')}
          />
          {/* 添加成员*/}
          <Modal
            title="添加成员"
            destroyOnClose
            width={1024}
            open={activeModal === 'addOne'}
            onCancel={() => setActiveModal('')}
            onOk={async () => {
              for (const target of selectPerson) {
                await current.pullMember(target);
              }
              tforceUpdate();
              setActiveModal('');
            }}>
            {isTopGroup ? (
              <SearchCompany
                searchCallback={setSelectPerson}
                searchType={TargetType.Company}
              />
            ) : (
              <AssignPosts searchFn={setSelectPerson} source={getTopGroup as ITarget} />
            )}
          </Modal>

          {/* 变更集团 */}
          <TransferDepartment
            title={'转移集团'}
            open={activeModal === 'transfer'}
            handleOk={() => {
              tforceUpdate();
              setActiveModal('');
            }}
            onCancel={() => setActiveModal('')}
            current={current}
            needTransferUser={selectPerson[0]}
          />
          {/* 对象设置 */}
          <AddPostModal
            title={'权限设置'}
            open={activeModal === 'post'}
            handleOk={() => setActiveModal('')}
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
