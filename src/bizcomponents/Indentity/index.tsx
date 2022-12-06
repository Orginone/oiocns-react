import { Card, Button, Descriptions, Modal, message, Layout, ModalProps } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Title from 'antd/lib/typography/Title';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { schema } from '@/ts/base';
import { IIdentity } from '@/ts/core/target/authority/iidentity';
import { XTarget } from '@/ts/base/schema';
import { TargetType } from '@/ts/core/enum';
import { columns } from './config';
import EditIndentityModal from './components/EditIndentityModal';
import TreeLeftDeptPage from './components/TreeLeftPosPage';
import AssignPosts from './components/AssignPosts';
import cls from './index.module.less';
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
  MemberData: schema.XTarget[]; // 当前可分配的人员数据
};
/**
 * 身份设置
 * @returns
 */
const SettingDept: React.FC<IndentityManageType & ModalProps> = (props) => {
  const { open, object, MemberData, ...other } = props;
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [indentity, setIndentity] = useState<IIdentity>();
  const [indentitys, setIndentitys] = useState<IIdentity[]>([]);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [members, setMembers] = useState<schema.XTarget[]>([]);
  const [person, setPerson] = useState<schema.XTarget[]>();
  const [personData, setPersonData] = useState<XTarget[]>([]);
  useEffect(() => {
    if (open) {
      getDataList();
      setMembers([]);
    } else {
      setIndentity(undefined);
    }
  }, [open]);
  // 左侧岗位数据
  const getDataList = async () => {
    const data = await object?.getIdentitys();
    setIndentitys(data);
    setTreeCurrent(data[0]);
  };
  // 加载 人员数据
  const getPersonData = async (current: IIdentity) => {
    const res = await current.getIdentityTargets(TargetType.Person);
    if (res?.data?.result) {
      setPersonData(res.data.result);
      setMembers(uniq(MemberData, res.data.result));
    } else {
      setPersonData([]);
      setMembers(MemberData);
    }
  };
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

  // /**点击操作内容触发的事件 */
  // const handleMenuClick = (key: string, item: any) => {
  //   console.log(key, item);
  // };

  // 选中树的时候操作
  const setTreeCurrent = async (current: IIdentity) => {
    setIndentity(current);
    await getPersonData(current);
  };
  // 去除已经选上的数据
  const uniq = (arr1: schema.XTarget[], arr2: schema.XTarget[]): schema.XTarget[] => {
    if (arr1.length === 0) {
      return [];
    }
    let ids = arr2.map((item) => item.id);
    return arr1.filter((el) => {
      return !ids.includes(el.id);
    });
  };
  // 岗位操作
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
            const success = await object?.deleteIdentity(indentity?.target.id!);
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

  // 岗位信息内容
  const content = (
    <div className={cls['company-dept-content']}>
      <Card bordered={false}>
        <Descriptions
          title={<Title level={5}>岗位信息</Title>}
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
      </Card>
    </div>
  );
  // 按钮
  const renderBtns = (
    <Button type="link" onClick={async () => setIsOpenAssign(true)}>
      指派岗位
    </Button>
  );

  // 岗位信息标题

  //岗位主体
  const deptCount = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card
          title={'管理员'}
          className={cls['app-tabs']}
          extra={renderBtns}
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
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      {...other}>
      <Layout>
        <Sider>
          <TreeLeftDeptPage
            setCurrent={setTreeCurrent}
            currentKey={indentity ? indentity?.id : ''}
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
              onOk={() => setIsOpenModal(false)}
              handleOk={() => setIsOpenModal(false)}
              defaultData={indentity!}
              callback={getDataList}
              reObject={object}
            />
            <Modal
              title="指派岗位"
              open={isOpenAssign}
              width={900}
              destroyOnClose
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
              onCancel={() => setIsOpenAssign(false)}>
              <AssignPosts searchCallback={setPerson} memberData={members} />
            </Modal>
          </div>
        </Content>
      </Layout>
    </Modal>
  );
};

export default SettingDept;
