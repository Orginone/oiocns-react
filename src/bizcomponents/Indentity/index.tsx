import { Card, Button, Descriptions, Modal, message, Layout, ModalProps } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { schema } from '@/ts/base';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import { XTarget } from '@/ts/base/schema';
import { columns } from './config';
import EditIndentityModal from './components/AddPositionMoadl';
import TreeLeftDeptPage from './components/TreeLeftPosPage';
import AssignPosts from './components/AssignPosts';
import cls from './index.module.less';
import { ITarget } from '@/ts/core';
import { MarketTypes } from 'typings/marketType';

const { Sider, Content } = Layout;
type IndentityManageType = {
  open: boolean;
  current: ITarget;
};
/**
 * 身份设置
 * @returns
 */
const SettingIdentity: React.FC<IndentityManageType & ModalProps> = (props) => {
  const { open, current, ...other } = props;
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [indentity, setIndentity] = useState<IIdentity>();
  const [indentitys, setIndentitys] = useState<IIdentity[]>([]);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [members, setMembers] = useState<schema.XTarget[]>([]);
  const [currentPerson, setPerson] = useState<schema.XTarget[]>();
  const [personData, setPersonData] = useState<XTarget[]>([]);
  useEffect(() => {
    if (open) {
      getDataList();
      setMembers([]);
    } else {
      setIndentity(undefined);
    }
  }, [open]);
  // 左侧身份数据
  const getDataList = async () => {
    const data = await current.getIdentitys();
    setIndentitys(data);
    if (!indentity && data.length > 0) {
      await setTreeCurrent(data[0]);
    }
  };
  // 点击选中加载
  const getPersonData = async (currentIndentity: IIdentity) => {
    const res = await currentIndentity.loadMembers({
      offset: 0,
      filter: '',
      limit: 65535,
    });
    if (res?.result) {
      //加载身份下的成员
      setPersonData(res.result);
      //加载可指派成员
      setMembers(
        (
          await current.loadMembers({
            offset: 0,
            filter: '',
            limit: 65535,
          })
        ).result!,
      );
    } else {
      setPersonData([]);
    }
  };
  // 操作内容渲染函数
  const renderOperation = (item: MarketTypes.ProductType): common.OperationType[] => {
    return [
      {
        key: 'remove',
        label: '移除人员',
        onClick: async () => {
          Modal.confirm({
            title: '提示',
            content: '是否确认移除该人员',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              await indentity?.removeMembers([item.id]);
              getPersonData(indentity!);
            },
          });
        },
      },
    ];
  };

  // 选中树的时候操作
  const setTreeCurrent = async (current: IIdentity) => {
    setIndentity(current);
    await getPersonData(current);
  };
  // 身份信息操作
  const buttons = [
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
            const success = await current?.deleteIdentity(indentity?.target.id!);
            if (success) {
              message.success('删除成功');
              getDataList();
              setPersonData([]);
              setIndentity(undefined);
            } else {
              message.error('删除失败');
            }
          },
        });
      }}>
      删除
    </Button>,
  ];

  // 身份信息内容
  const content = (
    <div className={cls['company-dept-content']}>
      <Descriptions
        title="身份信息"
        bordered
        column={2}
        size="small"
        labelStyle={{ textAlign: 'center' }}
        contentStyle={{ textAlign: 'center' }}
        extra={buttons}>
        <Descriptions.Item label="名称">{indentity?.target.name}</Descriptions.Item>
        <Descriptions.Item label="编码">{indentity?.target.code}</Descriptions.Item>
        <Descriptions.Item label="创建人">
          {indentity?.target.createUser}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {indentity?.target.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {indentity?.target.remark}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
  // 按钮
  const renderBtns = (
    <Button type="link" onClick={async () => setIsOpenAssign(true)}>
      指派身份
    </Button>
  );

  // 身份信息标题

  //身份主体
  const deptCount = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card
          title={indentity?.target.name}
          className={cls['app-tabs']}
          extra={renderBtns}
          bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={personData as any}
                rowKey={'id'}
                total={personData.length || 0}
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
      title="身份设置"
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      {...other}>
      <Layout style={{ height: 682, overflow: 'hidden' }}>
        <Sider>
          <TreeLeftDeptPage
            setCurrent={setTreeCurrent}
            currentKey={indentity ? indentity?.id : ''}
            indentitys={indentitys}
            // reObject={object}
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
                getDataList();
                setIsOpenModal(false);
              }}
              editData={indentity!}
              // reObject={object}
            />
            <Modal
              title="指派身份"
              open={isOpenAssign}
              width={900}
              destroyOnClose
              onCancel={() => setIsOpenAssign(false)}
              onOk={async () => {
                setIsOpenAssign(false);
                const ids = [];
                for (const a of currentPerson ? currentPerson : []) {
                  ids.push(a.id);
                }
                await indentity?.pullMembers(ids);
                getPersonData(indentity!);
                message.success('指派成功');
              }}>
              <AssignPosts searchFn={setPerson} memberData={members} current={current} />
            </Modal>
          </div>
        </Content>
      </Layout>
    </Modal>
  );
};

export default SettingIdentity;
