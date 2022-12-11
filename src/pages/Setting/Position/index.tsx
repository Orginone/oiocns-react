/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import { Card, Modal, Button, Space, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { columns, indentitycolumns } from './config';
import TreeLeftDeptPage from './components/TreeLeftPosPage/CreatePos';
import { RouteComponentProps } from 'react-router-dom';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { schema } from '@/ts/base';
import IndentityManage, { ResultType } from '@/bizcomponents/IndentityManage';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { XIdentity } from '@/ts/base/schema';
import { ActionType } from '@ant-design/pro-table';
import { IStation } from '@/ts/core/target/itarget';
import CreateTeam from '@/bizcomponents/CreateTeam';
import { TargetType } from '@/ts/core';

type RouterParams = {
  id: string;
};
/**
 * 岗位设置
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps<RouterParams>> = () => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [positions, setPositions] = useState<IStation[]>([]); //岗位列表
  const [_currentPostion, setCurrentPosition] = useState<IStation>(); //当前选中岗位
  const [editPostion, setEditPosition] = useState<IStation>(); //当前需要编辑的岗位
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [persons, setPersons] = useState<schema.XTarget[]>(); //选中的待指派人员列表
  const [addIndentitys, setAddIndentitys] = useState<XIdentity[]>(); //待添加的身份数据集
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false); // 编辑岗位模态框
  const [isFlag, setIsFlag] = useState<string>(''); // title

  const treeContainer = document.getElementById('templateMenu');
  //监听
  useEffect(() => {
    getPositions();
  }, []);
  const getPositions = async () => {
    const res = await userCtrl.company.getStations();
    setPositions([...res]);
    console.log('岗位数据', positions);
  };
  const actionRef = useRef<ActionType>();
  const IndentityActionRef = useRef<ActionType>();

  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    return [
      {
        key: 'remove',
        label: '移出岗位',
        onClick: async () => {
          Modal.confirm({
            title: '提示',
            content: '是否确认移出岗位',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const res = await _currentPostion!.removeMembers(
                [item.id],
                TargetType.Person,
              );
              reload();
              indentityReload();
              if (res) {
                message.success('删除成功');
                indentityReload();
              } else {
                message.error('删除失败');
              }
            },
          });
        },
      },
    ];
  };
  // 操作内容渲染函数
  const reRenderOperation = (item: XIdentity): any[] => {
    return [
      {
        key: 'remove',
        label: '删除',
        onClick: async () => {
          Modal.confirm({
            title: '提示',
            content: '是否确认删除',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const res = await _currentPostion?.removeIdentitys([item.id]);
              indentityReload();
              if (res) {
                message.success('删除成功');
                indentityReload();
              } else {
                message.error('删除失败');
              }
            },
          });
          console.log('按钮事件', 'remove', item);
        },
      },
    ];
  };
  /**点击操作内容触发的事件 */
  const handleMenuClick = async (key: string, item: any) => {
    console.log(item);
    switch (key) {
      case '删除':
        await item.object.delete();
        await getPositions();
        setCurrentPosition(undefined);
        break;
      case '更改岗位名称':
        setIsFlag('编辑');
        setIsOpenEditModal(true);
        setEditPosition(item.object);
        break;
      case '新建':
        setIsFlag('新建');
        setIsOpenEditModal(true);
        setEditPosition(undefined);
        break;
    }
  };
  // 选中树的时候操作
  const setTreeCurrent = async (current: IStation) => {
    //保存当前选中的岗位
    setCurrentPosition(current);
  };
  //刷新表格
  const reload = () => {
    actionRef.current?.reload();
  };
  //刷新表格
  const indentityReload = () => {
    IndentityActionRef.current?.reload();
  };
  /**添加框内选中组织后的数据转换 */
  const onCheckeds = (result: ResultType[]) => {
    const identityData: XIdentity[] = [];
    result.map((item) => {
      item.identitys.map((obj) => {
        obj.belong = item.target;
        identityData.push(obj);
      });
    });
    setAddIndentitys(identityData);
  };

  /**头部 */
  const header = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}></div>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                toolBarRender={() => [
                  <Button
                    className={cls.creatgroup}
                    style={{ float: 'right' }}
                    type="primary"
                    onClick={() => {
                      setIsAddOpen(true);
                    }}>
                    添加
                  </Button>,
                ]}
                headerTitle={_currentPostion ? _currentPostion.name : ''}
                dataSource={[]}
                rowKey={'id'}
                operation={reRenderOperation}
                actionRef={IndentityActionRef}
                options={{
                  reload: false,
                  density: false,
                  setting: false,
                  search: true,
                }}
                request={async (page) => {
                  return await _currentPostion!.loadIdentitys(page);
                }}
                columns={indentitycolumns as any}
                parentRef={parentRef}
                showChangeBtn={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  /**人员列表 */
  const personCount = (
    <div className={`${cls['dept-wrap-pages']}`} style={{ paddingTop: '10px' }}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                headerTitle={'岗位人员'}
                dataSource={[] as any}
                rowKey={'id'}
                tableAlertOptionRender={(selectedRowKeys: any) => {
                  return (
                    <Space size={16}>
                      <a
                        onClick={() => {
                          Modal.confirm({
                            title: '提示',
                            content: '是否确认删除',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: async () => {
                              const res = await _currentPostion?.removeMembers(
                                selectedRowKeys.selectedRowKeys,
                                TargetType.Person,
                              );
                              reload();
                              actionRef.current?.clearSelected!();
                              if (res) {
                                message.success('删除成功');
                                indentityReload();
                              } else {
                                message.error('删除失败');
                              }
                            },
                          });
                        }}>
                        批量删除
                      </a>
                    </Space>
                  );
                }}
                toolBarRender={() => [
                  <Button
                    className={cls.creatgroup}
                    type="primary"
                    style={{ float: 'right' }}
                    onClick={() => {
                      setIsOpenAssign(true);
                    }}>
                    添加
                  </Button>,
                ]}
                options={{
                  reload: false,
                  density: false,
                  setting: false,
                  search: true,
                }}
                operation={renderOperation}
                request={async (page) => {
                  return await _currentPostion!.loadMembers(page);
                }}
                actionRef={actionRef}
                columns={columns as any}
                parentRef={parentRef}
                showChangeBtn={false}
                rowSelection={{}}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  return (
    <div className={cls[`dept-content-box`]}>
      {_currentPostion && header}
      {_currentPostion && personCount}
      <Modal
        title="添加身份"
        open={isAddOpen}
        destroyOnClose={true}
        onOk={async () => {
          const resultIds: string[] = [];
          addIndentitys?.map((item) => {
            resultIds.push(item.id);
          });
          await _currentPostion?.pullIdentitys(resultIds);
          indentityReload();
          setIsAddOpen(false);
        }}
        onCancel={() => setIsAddOpen(false)}
        width="1050px">
        <IndentityManage multiple={true} onCheckeds={onCheckeds} />
      </Modal>
      <Modal
        title="指派岗位"
        open={isOpenAssign}
        destroyOnClose={true}
        width={1300}
        onOk={async () => {
          setIsOpenAssign(false);
          const ids = [];
          for (const a of persons!) {
            ids.push(a.id);
          }
          await _currentPostion?.pullMembers(ids, TargetType.Person);
          reload();
        }}
        onCancel={() => {
          setIsOpenAssign(false);
        }}>
        <AssignPosts searchFn={setPersons} />
      </Modal>
      <CreateTeam
        handleCancel={() => setIsOpenEditModal(false)}
        open={isOpenEditModal}
        title={isFlag}
        current={editPostion || userCtrl.company}
        typeNames={[TargetType.Station]}
        handleOk={async () => {
          setIsOpenEditModal(false);
          await getPositions();
        }}
      />
      {/* 左侧树 */}
      {treeContainer
        ? ReactDOM.createPortal(
            <TreeLeftDeptPage
              setCurrent={setTreeCurrent}
              handleMenuClick={handleMenuClick}
              currentKey={_currentPostion?.id || ''}
              positions={positions}
              reload={getPositions}
            />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default SettingDept;
