import { Card, Modal, Button } from 'antd';
import React, { useState, useRef } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { schema } from '@/ts/base';
import IndentityManage from '@/bizcomponents/IndentityManage';
import { IIdentity, IStation } from '@/ts/core';
import { IdentityColumn, PersonColumns } from './column';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import FullScreenModal from '@/executor/tools/fullScreen';

interface IProps {
  current: IStation;
  finished: () => void;
}
/**
 * 岗位设置
 * @returns
 */
const Station: React.FC<IProps> = ({ current, finished }: IProps) => {
  const [key, forceUpdate] = useObjectUpdate(current);
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isOpenPerson, setIsOpenPerson] = useState<boolean>(false);
  const [selectPersons, setSelectPersons] = useState<schema.XTarget[]>(); //选中的待指派成员列表
  const [selectIdentitys, setSelectIdentitys] = useState<IIdentity[]>(); //待添加的角色数据集
  const [isOpenSelectIdentityModal, setIsOpenIdentityModal] = useState<boolean>(false); //角色选择模态框

  // 成员表格操作内容渲染函数
  const personOperation = (item: schema.XTarget): any[] => {
    return [
      current.hasRelationAuth() ? (
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除成员</span>,
          onClick: async () => {
            Modal.confirm({
              content: '是否移除该成员？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                if (await current.removeMembers([item])) {
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

  // 角色表格操作内容渲染函数
  const identityOperation = (item: schema.XIdentity): any[] => {
    return [
      current.hasRelationAuth() ? (
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除角色</span>,
          onClick: async () => {
            Modal.confirm({
              content: '是否移除该角色？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                if (await current.removeIdentitys([item])) {
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

  /**角色列表 */
  const identityContent = (
    <div className={`${cls['dept-wrap-pages']}`} style={{ height: '400px' }}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                rowKey={'id'}
                params={key}
                headerTitle={'角色管理'}
                operation={identityOperation}
                dataSource={current.identitys}
                columns={IdentityColumn}
                parentRef={parentRef}
                showChangeBtn={false}
                toolBarRender={() => [
                  current.hasRelationAuth() ? (
                    <Button
                      className={cls.creatgroup}
                      type="link"
                      style={{ float: 'right' }}
                      onClick={() => {
                        setIsOpenIdentityModal(true);
                      }}>
                      添加角色
                    </Button>
                  ) : (
                    <></>
                  ),
                ]}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  /**成员列表 */
  const personContent = (
    <div className={`${cls['dept-wrap-pages']}`} style={{ paddingTop: '0px' }}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card className={cls['app-tabs']} bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                rowKey={'id'}
                params={key}
                headerTitle={'成员管理'}
                dataSource={current.members}
                toolBarRender={() => [
                  current.hasRelationAuth() ? (
                    <Button
                      key={'addperson'}
                      className={cls.creatgroup}
                      type="link"
                      style={{ float: 'right' }}
                      onClick={() => {
                        setSelectPersons([]);
                        setIsOpenPerson(true);
                      }}>
                      添加成员
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
    <FullScreenModal
      open
      onCancel={finished}
      width="80vw"
      title={`岗位[${current.name}]设置`}
      destroyOnClose
      footer={[]}>
      <div className={cls[`dept-content-box`]}>
        {identityContent}
        {personContent}
      </div>
      <Modal
        title="添加角色"
        open={isOpenSelectIdentityModal}
        destroyOnClose={true}
        onOk={async () => {
          if (selectIdentitys) {
            if (await current.pullIdentitys(selectIdentitys.map((a) => a.metadata))) {
              forceUpdate();
            }
            setIsOpenIdentityModal(false);
          }
        }}
        onCancel={() => setIsOpenIdentityModal(false)}
        width="1050px">
        <IndentityManage
          space={current.space}
          multiple={true}
          onCheckeds={(checks) => {
            setSelectIdentitys(checks.map((a) => a.identitys).flat());
          }}
        />
      </Modal>
      <Modal
        title="添加岗位成员"
        open={isOpenPerson}
        destroyOnClose={true}
        width={1300}
        onOk={async () => {
          setIsOpenPerson(false);
          if (selectPersons) {
            if (await current.pullMembers(selectPersons)) {
              forceUpdate();
            }
          }
        }}
        onCancel={() => {
          setIsOpenPerson(false);
        }}>
        <AssignPosts members={current.space.members} searchFn={setSelectPersons} />
      </Modal>
    </FullScreenModal>
  );
};
export default Station;
