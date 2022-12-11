/* eslint-disable no-unused-vars */
import { Card, Modal, Button, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { columns, indentitycolumns } from './config';
import StationTree from './components/TreeLeftPosPage';
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
import ReactDOM from 'react-dom';
/**
 * 岗位设置
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps> = () => {
  const actionRef = useRef<ActionType>();
  const IndentityActionRef = useRef<ActionType>();
  const parentRef = useRef<any>(null); //父级容器Dom
  const treeContainer = document.getElementById('templateMenu');

  const [current, setCurrent] = useState<IStation>(); //当前操作岗位
  const [stations, setStations] = useState<any[]>([]); //岗位列表
  const [isOpenPerson, setIsOpenPerson] = useState<boolean>(false);
  const [selectPersons, setSelectPersons] = useState<schema.XTarget[]>(); //选中的待指派人员列表
  const [selectIdentitys, setSelectIdentitys] = useState<XIdentity[]>(); //待添加的身份数据集
  const [isOpenSelectIdentityModal, setIsOpenIdentityModal] = useState<boolean>(false); //身份选择模态框
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false); // 编辑岗位模态框

  //监听
  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async (reload: boolean = false) => {
    const stations = await userCtrl.company.getStations(reload);
    let data: { title: string; key: string; object: IStation }[] = [];
    stations.forEach((a) => {
      data.push({
        title: a.name,
        key: a.id,
        object: a,
      });
    });
    setStations([...data]);
  };

  // 人员表格操作内容渲染函数
  const personOperation = (item: schema.XTarget): any[] => {
    return [
      {
        key: 'remove',
        label: <span style={{ color: 'red' }}>移除</span>,
        onClick: async () => {
          if (await current?.removeMember(item)) {
            actionRef.current?.reload();
          }
        },
      },
    ];
  };

  // 身份表格操作内容渲染函数
  const identityOperation = (item: XIdentity): any[] => {
    return [
      {
        key: 'remove',
        label: <span style={{ color: 'red' }}>移除</span>,
        onClick: async () => {
          if (await current?.removeIdentitys([item.id])) {
            IndentityActionRef.current?.reload();
          }
        },
      },
    ];
  };

  // 左侧岗位树操作内容触发的事件
  const treeMenuClick = async (key: string, item: any) => {
    switch (key) {
      case '编辑':
        setIsOpenEditModal(true);
        setCurrent(item.object);
        break;
      case '删除':
        if (await (item.object as IStation).delete()) {
          setCurrent(undefined);
          loadStations(false);
        }
        break;
    }
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
    setSelectIdentitys(identityData);
  };

  /**头部 */
  const header = current && (
    <div className={`${cls['dept-wrap-pages']}`} style={{ height: '400px' }}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}>
            <strong style={{ marginLeft: '20px', fontSize: 15 }}>{current.name}</strong>
            <Button
              className={cls.creatgroup}
              type="primary"
              style={{ float: 'right' }}
              onClick={() => {
                setIsOpenIdentityModal(true);
              }}>
              添加身份
            </Button>
          </div>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={[]}
                rowKey={'id'}
                operation={identityOperation}
                actionRef={IndentityActionRef}
                request={async (page) => {
                  let data = await current!.loadIdentitys(true);
                  return {
                    offset: page.offset,
                    limit: page.limit,
                    total: data.length,
                    result: data.slice(page.offset, page.limit),
                  };
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
                              await current?.removeMembers(
                                selectedRowKeys.selectedRowKeys,
                                TargetType.Person,
                              );
                              actionRef.current?.reload();
                              actionRef.current?.clearSelected!();
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
                      setSelectPersons([]);
                      setIsOpenPerson(true);
                    }}>
                    指派人员
                  </Button>,
                ]}
                options={{
                  reload: false,
                  density: false,
                  setting: false,
                  search: true,
                }}
                operation={personOperation}
                request={async (page) => {
                  return await current!.loadMembers(page);
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
      {current && header}
      {current && personCount}
      <Modal
        title="添加身份"
        open={isOpenSelectIdentityModal}
        destroyOnClose={true}
        onOk={async () => {
          if (selectIdentitys) {
            if (await current?.pullIdentitys(selectIdentitys)) {
              IndentityActionRef.current?.reload();
            }
            setIsOpenIdentityModal(false);
          }
        }}
        onCancel={() => setIsOpenIdentityModal(false)}
        width="1050px">
        <IndentityManage multiple={true} onCheckeds={onCheckeds} />
      </Modal>
      <Modal
        title="添加岗位成员"
        open={isOpenPerson}
        destroyOnClose={true}
        width={1300}
        onOk={async () => {
          setIsOpenPerson(false);
          if (selectPersons) {
            if (
              await current?.pullMembers(
                selectPersons?.map((a) => a.id),
                TargetType.Person,
              )
            ) {
              actionRef.current?.reload();
            }
          }
        }}
        onCancel={() => {
          setIsOpenPerson(false);
        }}>
        <AssignPosts searchFn={setSelectPersons} />
      </Modal>
      <CreateTeam
        handleCancel={() => setIsOpenEditModal(false)}
        open={isOpenEditModal}
        title={'编辑'}
        current={current!}
        typeNames={[TargetType.Station]}
        handleOk={async () => {
          setIsOpenEditModal(false);
          await loadStations();
        }}
      />
      {/* 左侧树 */}
      {treeContainer ? (
        ReactDOM.createPortal(
          <StationTree
            setCurrent={setCurrent}
            handleMenuClick={treeMenuClick}
            currentKey={current?.id || ''}
            positions={stations}
            reload={loadStations}
          />,
          treeContainer,
        )
      ) : (
        <></>
      )}
    </div>
  );
};
export default SettingDept;
