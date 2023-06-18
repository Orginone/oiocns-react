import { Card, Button, Descriptions, Modal, Layout, ModalProps } from 'antd';
import React, { useState, useRef } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { schema } from '@/ts/base';
import { XTarget } from '@/ts/base/schema';
import EditIdentityModal from './components/AddPositionMoadl';
import AssignPosts from './components/AssignPosts';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import cls from './index.module.less';
import { IIdentity } from '@/ts/core';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import FullScreenModal from '@/executor/tools/fullScreen';
import { ProColumns } from '@ant-design/pro-table';

const { Content } = Layout;
type IdentityManageType = {
  identity: IIdentity;
  finished: () => void;
};
/**
 * 角色设置
 * @returns
 */
const IdentityModal: React.FC<IdentityManageType & ModalProps> = (props) => {
  const { identity, finished } = props;
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [currentPerson, setPerson] = useState<schema.XTarget[]>();
  const [key, forceUpdate] = useObjectUpdate(identity);

  // 操作内容渲染函数
  const renderOperation = (item: XTarget) => {
    return [
      identity.current.hasRelationAuth() ? (
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
                await identity?.removeMembers([item]);
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
  // 角色信息操作
  const buttons = identity.current.hasRelationAuth()
    ? [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setIsOpenModal(true);
          }}>
          编辑
        </Button>,
      ]
    : [];

  // 角色信息内容
  const content = (
    <>
      {identity && (
        <div className={cls['company-dept-content']}>
          <Descriptions
            title="角色信息"
            bordered
            column={2}
            size="small"
            labelStyle={{ textAlign: 'center' }}
            contentStyle={{ textAlign: 'center' }}
            extra={buttons}>
            <Descriptions.Item label="名称">{identity.name}</Descriptions.Item>
            <Descriptions.Item label="编码">{identity.code}</Descriptions.Item>
            <Descriptions.Item label="创建人">
              <EntityIcon entityId={identity.metadata.createUser} size={22} />
              <strong>{identity.creater.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {identity.metadata.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {identity.remark}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </>
  );
  // 按钮
  const renderBtns = identity.current.hasRelationAuth() ? (
    <Button type="link" onClick={async () => setIsOpenAssign(true)}>
      指派角色
    </Button>
  ) : (
    <></>
  );

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      fixed: 'left',
      width: 50,
      render: (_key: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '账号',
      dataIndex: 'code',
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  //角色主体
  const deptCount = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card
          title={identity?.name}
          className={cls['app-tabs']}
          extra={renderBtns}
          bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable<XTarget>
                rowKey={'id'}
                params={key}
                dataSource={identity.members}
                operation={renderOperation}
                columns={columns}
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
    <FullScreenModal
      open
      onCancel={finished}
      width="80vw"
      title="角色设置"
      destroyOnClose
      footer={[]}>
      <Layout style={{ height: 682, overflow: 'hidden' }}>
        <Content style={{ paddingLeft: 4 }}>
          <div className={cls[`dept-content-box`]}>
            {content}
            {deptCount}
            {/* 编辑 */}
            <EditIdentityModal
              title="编辑"
              handleCancel={() => setIsOpenModal(false)}
              open={isOpenModal}
              handleOk={() => {
                setIsOpenModal(false);
              }}
              editData={identity}
              current={identity.current}
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
                  await identity?.pullMembers(currentPerson);
                }
                forceUpdate();
              }}>
              <AssignPosts
                members={identity.current.members.filter((a) =>
                  identity.members.every((s) => s.id != a.id),
                )}
                searchFn={setPerson}
              />
            </Modal>
          </div>
        </Content>
      </Layout>
    </FullScreenModal>
  );
};

export default IdentityModal;
