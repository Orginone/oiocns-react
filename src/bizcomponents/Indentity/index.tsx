/* eslint-disable no-unused-vars */
import {
  Card,
  Button,
  Descriptions,
  Space,
  Modal,
  message,
  Layout,
  ModalProps,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { columns } from './config';
import EditIndentityModal from './components/EditIndentityModal';
import TreeLeftDeptPage from './components/TreeLeftPosPage/CreatePos';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import { XTarget } from '@/ts/base/schema';
import { TargetType } from '@/ts/core/enum';
import AssignPosts from './components/AssignPosts';
import { schema } from '@/ts/base';
import {
  IDepartment,
  IPerson,
  IGroup,
  ICompany,
  ICohort,
} from '@/ts/core/target/itarget';
const { Sider, Content } = Layout;
type IndentityManageType = {
  open: boolean;
  object: IDepartment | IPerson | IGroup | ICompany | ICohort;
  MemberData: schema.XTarget[];
};
/**
 * 身份设置
 * @returns
 */
const SettingDept: React.FC<IndentityManageType & ModalProps> = (props) => {
  const { open, object, MemberData, ...other } = props;
  console.log(open, object, MemberData);
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [indentity, setIndentity] = useState<IIdentity>();
  const [indentitys, setIndentitys] = useState<IIdentity[]>([]);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [memberData, setMemberData] = useState<schema.XTarget[]>([]);
  const [person, setPerson] = useState<schema.XTarget[]>();
  const [personData, setPersonData] = useState<XTarget[]>();

  const getDataList = async () => {
    setIndentitys(await object?.getIdentitys());
  };
  useEffect(() => {
    if (open) {
      getDataList();
    }
  }, [open]);

  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
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
              await indentity?.removeIdentity([item.id]);
              getPersonData(indentity!);
            },
          });
        },
      },
    ];
  };

  const onOk = () => {
    setIsOpenModal(false);
  };
  const handleOk = () => {
    setIsOpenModal(false);
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {
    console.log(key, item);
  };
  const getPersonData = async (current: IIdentity) => {
    setPersonData((await current.getIdentityTargets(TargetType.Person)).data.result);
  };
  // 选中树的时候操作
  const setTreeCurrent = async (current: IIdentity) => {
    getPersonData(current);
    setIndentity(current);
  };
  const getMemberData = async () => {
    setMemberData(MemberData);
  };
  // 岗位信息标题
  const title = (
    <div className={cls['company-dept-title']}>
      <div>
        <Title level={4}>岗位信息</Title>
      </div>
      <div>
        <Button
          type="link"
          onClick={() => {
            setIsOpenModal(true);
            setIndentity(indentity);
          }}>
          编辑
        </Button>
        <Button
          type="link"
          onClick={async () => {
            Modal.confirm({
              title: '提示',
              content: '是否确认删除',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const res = await object?.deleteIdentity(indentity?.target.id!);
                if (res) {
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
        </Button>
      </div>
    </div>
  );

  // 岗位信息内容
  const content = (
    <div className={cls['company-dept-content']}>
      <Card bordered={false}>
        <Descriptions title={title} bordered column={2}>
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
      </Card>
    </div>
  );
  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button
          type="link"
          onClick={async () => {
            await getMemberData(), setIsOpenAssign(true);
          }}>
          指派岗位
        </Button>
      </Space>
    );
  };

  // 岗位信息标题

  //岗位主体
  const deptCount = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card
          title={'管理员'}
          className={cls['app-tabs']}
          extra={renderBtns()}
          bordered={false}>
          <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={personData as any}
                rowKey={'id'}
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
      bodyStyle={{ paddingRight: 0, paddingBottom: 0 }}
      {...other}>
      {indentitys && (
        <Layout>
          <Sider>
            <TreeLeftDeptPage
              createTitle="新增"
              setCurrent={setTreeCurrent}
              handleMenuClick={handleMenuClick}
              currentKey={indentitys && indentitys.length > 0 ? indentitys[0].id : ''}
              indentitys={indentitys}
              reObject={object}
            />
          </Sider>
          <Content style={{ paddingLeft: 4 }}>
            <div className={cls[`dept-content-box`]}>
              {content}
              {deptCount}
              {/* 编辑 */}
              <EditIndentityModal
                handleCancel={() => {
                  setIsOpenModal(false);
                }}
                open={isOpenModal}
                onOk={onOk}
                handleOk={handleOk}
                defaultData={indentity!}
                callback={getDataList}
                reObject={object}
              />
              <Modal
                title="指派岗位"
                open={isOpenAssign}
                width={1300}
                onOk={async () => {
                  setIsOpenAssign(false);
                  const ids = [];
                  for (const a of person ? person : []) {
                    ids.push(a.id);
                  }
                  await indentity?.giveIdentity(ids);
                  getPersonData(indentity!);
                  message.success('指派成功');
                }}
                onCancel={() => {
                  setIsOpenAssign(false);
                }}>
                <AssignPosts searchCallback={setPerson} memberData={memberData} />
              </Modal>
            </div>
          </Content>
        </Layout>
      )}
    </Modal>
  );
};

export default SettingDept;
