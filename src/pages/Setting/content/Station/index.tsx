/* eslint-disable no-unused-vars */
import { Card, Modal, Button, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { schema } from '@/ts/base';
import IndentityManage, { ResultType } from '@/bizcomponents/IndentityManage';
import { XIdentity } from '@/ts/base/schema';
import { IStation } from '@/ts/core/target/itarget';
import { TargetType } from '@/ts/core';
import { IdentityColumn, PersonColumns } from '../../config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IsSuperAdmin } from '@/utils/authority';
import userCtrl from '@/ts/controller/setting';

interface IProps {
  current: IStation;
}
/**
 * 岗位设置
 * @returns
 */
const Station: React.FC<IProps> = (props) => {
  const { current } = props;
  const [key, forceUpdate] = useObjectUpdate(current);
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isSuperAdmin, SetIsSuperAdmin] = useState(false);
  const [isOpenPerson, setIsOpenPerson] = useState<boolean>(false);
  const [selectPersons, setSelectPersons] = useState<schema.XTarget[]>(); //选中的待指派人员列表
  const [selectIdentitys, setSelectIdentitys] = useState<XIdentity[]>(); //待添加的角色数据集
  const [isOpenSelectIdentityModal, setIsOpenIdentityModal] = useState<boolean>(false); //角色选择模态框

  useEffect(() => {
    setTimeout(async () => {
      SetIsSuperAdmin(await IsSuperAdmin(userCtrl.space));
    }, 10);
  }, [current]);

  // 人员表格操作内容渲染函数
  const personOperation = (item: schema.XTarget): any[] => {
    return [
      isSuperAdmin ? (
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除</span>,
          onClick: async () => {
            if (await current.removeMember(item)) {
              forceUpdate();
            }
          },
        }
      ) : (
        <></>
      ),
    ];
  };

  // 角色表格操作内容渲染函数
  const identityOperation = (item: XIdentity): any[] => {
    return [
      isSuperAdmin ? (
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除</span>,
          onClick: async () => {
            Modal.confirm({
              content: '是否移除该角色？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                if (await current.removeIdentitys([item.id])) {
                  forceUpdate();
                }
              },
            });
          },
        }
      ) : (
        <></>
      ),
    ];
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
  const header = (
    <div className={`${cls['dept-wrap-pages']}`} style={{ height: '400px' }}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false} title={'岗位设置'}>
          <div className={cls.topMes} style={{ marginRight: '25px' }}>
            <strong style={{ marginLeft: '20px', fontSize: 15 }}>{current.name}</strong>
            {isSuperAdmin && (
              <Button
                className={cls.creatgroup}
                type="link"
                style={{ float: 'right' }}
                onClick={() => {
                  setIsOpenIdentityModal(true);
                }}>
                添加角色
              </Button>
            )}
          </div>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={[]}
                rowKey={'id'}
                params={key}
                operation={identityOperation}
                request={async (page) => {
                  let data = await current.loadIdentitys(true);
                  return {
                    offset: page.offset,
                    limit: page.limit,
                    total: data.length,
                    result: data.slice(page.offset, page.limit),
                  };
                }}
                columns={IdentityColumn}
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
                params={key}
                tableAlertOptionRender={(selectedRowKeys: any) => {
                  return (
                    isSuperAdmin && (
                      <Space size={16}>
                        <a
                          onClick={() => {
                            Modal.confirm({
                              content: '是否将人员从该岗位移出？',
                              okText: '确认',
                              cancelText: '取消',
                              onOk: async () => {
                                await current.removeMembers(
                                  selectedRowKeys.selectedRowKeys,
                                  TargetType.Person,
                                );
                                forceUpdate();
                              },
                            });
                          }}>
                          批量删除
                        </a>
                      </Space>
                    )
                  );
                }}
                toolBarRender={() => [
                  isSuperAdmin ? (
                    <Button
                      key={'addperson'}
                      className={cls.creatgroup}
                      type="link"
                      style={{ float: 'right' }}
                      onClick={() => {
                        setSelectPersons([]);
                        setIsOpenPerson(true);
                      }}>
                      添加人员
                    </Button>
                  ) : (
                    <></>
                  ),
                ]}
                options={{
                  reload: false,
                  density: false,
                  setting: false,
                  search: true,
                }}
                operation={personOperation}
                request={async (page) => {
                  return await current.loadMembers(page);
                }}
                columns={PersonColumns}
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
      {header}
      {personCount}
      <Modal
        title="添加角色"
        open={isOpenSelectIdentityModal}
        destroyOnClose={true}
        onOk={async () => {
          if (selectIdentitys) {
            if (await current.pullIdentitys(selectIdentitys)) {
              forceUpdate();
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
              forceUpdate();
            }
          }
        }}
        onCancel={() => {
          setIsOpenPerson(false);
        }}>
        <AssignPosts searchFn={setSelectPersons} />
      </Modal>
    </div>
  );
};
export default Station;
