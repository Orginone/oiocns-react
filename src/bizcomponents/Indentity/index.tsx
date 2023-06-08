import { Card, Button, Descriptions, Modal, message, Layout, ModalProps } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { schema } from '@/ts/base';
import { XTarget } from '@/ts/base/schema';
import { columns } from './config';
import EditIndentityModal from './components/AddPositionMoadl';
import TreeLeftDeptPage from './components/TreeLeftPosPage';
import AssignPosts from './components/AssignPosts';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import cls from './index.module.less';
import { IIdentity, ITarget, TargetType } from '@/ts/core';
import TeamIcon from '../GlobalComps/entityIcon';

const { Sider, Content } = Layout;
type IndentityManageType = {
  open: boolean;
  current: ITarget;
};
/**
 * 角色设置
 * @returns
 */
const SettingIdentity: React.FC<IndentityManageType & ModalProps> = (props) => {
  const { open, current, ...other } = props;
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [indentity, setIndentity] = useState<IIdentity>();
  const [indentitys, setIndentitys] = useState<IIdentity[]>([]);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [currentPerson, setPerson] = useState<schema.XTarget[]>();
  const [key, forceUpdate] = useObjectUpdate(indentity);
  useEffect(() => {
    if (open) {
      getDataList();
    } else {
      setIndentity(undefined);
    }
  }, [open]);
  // 左侧角色数据
  const getDataList = async (reflash: boolean = true) => {
    const data = await current.loadIdentitys();
    setIndentitys(data);
    if (reflash && data.length > 0) {
      await setTreeCurrent(data[0]);
    }
  };
  // 操作内容渲染函数
  const renderOperation = (item: XTarget) => {
    return [
      current.hasRelationAuth() ? (
        {
          key: 'remove',
          label: <span style={{ color: 'red' }}>移除</span>,
          onClick: async () => {
            Modal.confirm({
              title: '提示',
              content: '确认移除该人员',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                await indentity?.removeMembers([item]);
                forceUpdate();
              },
            });
          },
        }
      ) : (
        <></>
      ),
    ];
  };

  // 选中树的时候操作
  const setTreeCurrent = async (current: IIdentity) => {
    await current.loadMembers();
    setIndentity(current);
  };
  // 角色信息操作
  const buttons = current.hasRelationAuth()
    ? [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setIsOpenModal(true);
            setIndentity(indentity);
          }}>
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          onClick={async () => {
            Modal.confirm({
              title: '提示',
              content: '是否确认删除',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await indentity?.delete();
                if (success) {
                  message.success('删除成功');
                  setIndentity(undefined);
                  getDataList();
                }
              },
            });
          }}>
          删除
        </Button>,
      ]
    : [];

  // 角色信息内容
  const content = (
    <>
      {indentity && (
        <div className={cls['company-dept-content']}>
          <Descriptions
            title="角色信息"
            bordered
            column={2}
            size="small"
            labelStyle={{ textAlign: 'center' }}
            contentStyle={{ textAlign: 'center' }}
            extra={buttons}>
            <Descriptions.Item label="名称">{indentity.name}</Descriptions.Item>
            <Descriptions.Item label="编码">{indentity.code}</Descriptions.Item>
            <Descriptions.Item label="创建人">
              <TeamIcon
                typeName={TargetType.Person}
                entityId={indentity.metadata.createUser}
                size={22}
              />
              <strong>{indentity.creater.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {indentity.metadata.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {indentity.remark}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </>
  );
  // 按钮
  const renderBtns = current.hasRelationAuth() ? (
    <Button type="link" onClick={async () => setIsOpenAssign(true)}>
      指派角色
    </Button>
  ) : (
    <></>
  );
  // 角色信息标题

  //角色主体
  const deptCount = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card
          title={indentity?.name}
          className={cls['app-tabs']}
          extra={renderBtns}
          bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable<XTarget>
                dataSource={indentity?.members || []}
                rowKey={'id'}
                params={key}
                operation={renderOperation}
                columns={columns as any}
                parentRef={parentRef}
                showChangeBtn={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  return (
    <Modal
      open={open}
      width={1424}
      title="角色设置"
      destroyOnClose
      footer={[]}
      bodyStyle={{ padding: 0 }}
      {...other}>
      <Layout style={{ height: 682, overflow: 'hidden' }}>
        <Sider>
          <TreeLeftDeptPage
            setCurrent={setTreeCurrent}
            currentKey={indentity ? indentity?.id : ''}
            indentitys={indentitys}
            current={current}
          />
        </Sider>
        <Content style={{ paddingLeft: 4 }}>
          <div className={cls[`dept-content-box`]}>
            {content}
            {deptCount}
            {/* 编辑 */}
            <EditIndentityModal
              title="编辑"
              handleCancel={() => setIsOpenModal(false)}
              open={isOpenModal}
              handleOk={() => {
                getDataList(false);
                setIsOpenModal(false);
              }}
              editData={indentity!}
              current={current}
            />
            <Modal
              title="指派角色"
              open={isOpenAssign}
              width={900}
              destroyOnClose
              onCancel={() => setIsOpenAssign(false)}
              onOk={async () => {
                setIsOpenAssign(false);
                if (currentPerson) {
                  await indentity?.pullMembers(currentPerson);
                }
                forceUpdate();
              }}>
              <AssignPosts
                members={
                  indentity
                    ? current.members.filter((a) =>
                        indentity.members.every((s) => s.id != a.id),
                      )
                    : current.members
                }
                searchFn={setPerson}
              />
            </Modal>
          </div>
        </Content>
      </Layout>
    </Modal>
  );
};

export default SettingIdentity;
