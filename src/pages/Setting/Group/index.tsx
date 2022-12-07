/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Descriptions, Space, message, Modal, Tabs } from 'antd';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { columns } from './config';
// import { dataSource } from './datamock';
// import AddPersonModal from '../Dept/components/AddPersonModal';
// import LookApply from '../Dept/components/LookApply';
import { RouteComponentProps } from 'react-router-dom';
import TreeLeftGroupPage from './components/TreeLeftGroupPage/Creategroup';
import { schema } from '@/ts/base';
import EditCustomModal from './components/EditCustomModal';
import { ICompany, IGroup } from '@/ts/core/target/itarget';
import Group from '@/ts/core/target/group';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import ApplyInfoService from '@/bizcomponents/MyCompanySetting/ApplyInfo';
import SearchCompany from '@/bizcomponents/SearchCompany';
import Company from '@/ts/core/target/company';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PageCard from '@/components/PageCard';

/**
 * 集团设置
 * @returns
 */
const SettingGroup: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const treeContainer = document.getElementById('templateMenu');
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isopen, setIsOpen] = useState<boolean>(false); // 编辑
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加单位
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  // const [statusKey, setStatusKey] = useState('merchandise');
  const [currentGroup, setCurrentGroup] = useState<IGroup>();

  const [dataSource, setDataSource] = useState<schema.XTarget[]>([]);
  const [id, setId] = useState<string>('');
  const [joinKey, setJoinKey] = useState<string>('');
  const [joinTarget, setJoinTarget] = useState<schema.XTarget>();
  const [isOpenIndentity, setIsOpenIndentity] = useState<boolean>(false);

  const [selectId, setSelectId] = useState<string>('');
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {
    // currentGroup 刚来的时候选中
  }, []);

  // 选中树的时候操作
  const setTreeCurrent = (current: schema.XTarget | undefined) => {
    if (current) {
      setId(current.id);
      setCurrentGroup(new Group(current));
      currentGroup?.getCompanys(false).then((e) => {
        setDataSource(e);
      });
    } else {
      setId('');
      setCurrentGroup(undefined);
      setDataSource([]);
    }
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {
    console.log(key, item, '====');
    switch (key) {
      case 'new':
        setId('');
        setSelectId('new');
        setIsOpen(true);
        break;
      case '新增集团':
        setId(item.target.target.id);
        setCurrentGroup(item.target);
        setIsOpen(true);
        setSelectId('second');
        break;
      case 'changeGroup':
        break;
      case 'updateGroup':
        break;
    }
  };

  const onOk = () => {
    setIsOpen(false);
    setIsAddOpen(false);
    setLookApplyOpen(false);
  };

  const handlePullOk = async () => {
    setIsAddOpen(false);
    if (joinKey == '') {
      message.error('请选中要添加集团的单位！');
    } else {
      console.log(joinTarget);
      const comp: ICompany = new Company(joinTarget!);
      const res = await comp.applyJoinGroup(currentGroup?.target?.id!);
      message.info(res.msg);
    }
  };
  const handlePullCancel = () => {
    setIsAddOpen(false);
  };

  const handleApplyCancel = () => {
    setLookApplyOpen(false);
  };
  const handleApplyOk = async (item: any) => {
    setLookApplyOpen(false);
  };

  const handleCancel = async () => {
    setIsOpen(false);
  };

  const handleOk = async (item: any) => {
    // 新增
    if (item) {
      console.log(item);
      if (item.selectId == 'update') {
        // 更新集团
        if (userCtrl.IsCompanySpace) {
          item.teamCode = item.code;
          item.teamName = item.name;
          item.typeName = TargetType.Group;
          const res = await currentGroup?.update(item);
          if (res?.success) {
            message.info(res.msg);
            userCtrl.changCallback();
            setIsOpen(false);
          } else {
            message.error(res?.msg);
          }
        }
      } else {
        if (userCtrl.IsCompanySpace) {
          item.teamCode = item.code;
          item.teamName = item.name;

          item.typeName = TargetType.Group;
          if (id != '') {
            const res = await currentGroup?.createSubGroup(item);
            if (res?.success) {
              message.info(res.msg);
              userCtrl.changCallback();
              setIsOpen(false);
            } else {
              message.error(res?.msg);
            }
          } else {
            item.belongId = userCtrl.Company.target.id;
            const res = await userCtrl.Company.createGroup(item);
            if (res.success) {
              message.info(res.msg);
              userCtrl.changCallback();
              setIsOpen(false);
            } else {
              message.error(res.msg);
            }
          }
        }
      }
    } else {
      setIsAddOpen(false);
      setLookApplyOpen(false);
      setIsOpen(false);
    }
  };
  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): MarketTypes.OperationType[] => {
    return [
      {
        key: 'publish',
        label: '调整节点',
        onClick: () => {
          console.log('按钮事件', 'publish', item);
        },
      },
      {
        key: 'share',
        label: '岗位集团',
        onClick: () => {
          console.log('按钮事件', 'share', item);
        },
      },
      {
        key: 'detail',
        label: '移出集团',
        onClick: () => {
          console.log('按钮事件', 'detail', item);
        },
      },
    ];
  };
  // 标题tabs页
  const TitleItems = [
    {
      tab: `集团成员`,
      key: 'deptPerpeos',
    },
  ];

  // 集团信息标题
  const title = (
    <div className={cls['company-group-title']}>
      <div>
        <Title level={4}>节点信息</Title>
      </div>
      <div>
        <Button
          type="link"
          onClick={() => {
            if (currentGroup) {
              setIsOpen(true);
              setSelectId('update');
            }
          }}>
          编辑
        </Button>
        <Button
          type="link"
          onClick={() => {
            if (currentGroup) {
              Modal.confirm({
                title: '确认',
                icon: <ExclamationCircleOutlined />,
                content: '删除部门？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  // 删除子部门
                  // 如果是一级部门 Company 底下删除
                  // 如果是二级集团 从父集团底下删除；
                },
              });
            }
          }}>
          删除
        </Button>
      </div>
    </div>
  );

  // 集团信息内容
  const content = (
    <div className={cls['company-group-content']}>
      <Card bordered={false}>
        <Descriptions
          size="middle"
          title={title}
          bordered
          column={2}
          labelStyle={{ textAlign: 'center', color: '#606266' }}
          contentStyle={{ textAlign: 'center', color: '#606266' }}>
          <Descriptions.Item label="集团名称" contentStyle={{ width: '30%' }}>
            <strong>{currentGroup?.target.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="集团编码" contentStyle={{ width: '30%' }}>
            {currentGroup?.target.code}
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            {currentGroup?.target.createUser}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {currentGroup?.target.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {currentGroup?.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button type="link" onClick={() => {}}>
          集团岗位
        </Button>
        <Button
          type="link"
          onClick={() => {
            if (currentGroup != null) setIsAddOpen(true);
          }}>
          添加单位
        </Button>
        <Button type="link" onClick={() => history.push('/todo/org')}>
          查看申请
        </Button>
      </Space>
    );
  };
  //集团主体
  const deptCount = (
    <div className={cls['pages-wrap']}>
      <PageCard
        bordered={false}
        tabList={TitleItems}
        onTabChange={(key) => {}}
        bodyStyle={{ paddingTop: 16 }}>
        <div className={cls['page-content-table']} ref={parentRef}>
          <Tabs items={[{ label: `全部`, key: '1' }]} tabBarExtraContent={renderBtns()} />
          <CardOrTable<schema.XTarget>
            dataSource={dataSource}
            rowKey={'id'}
            operation={renderOperation}
            columns={columns}
            parentRef={parentRef}
            showChangeBtn={false}
          />
        </div>
      </PageCard>
    </div>
  );
  return (
    <div className={cls[`group-content-box`]}>
      {content}
      {deptCount}
      {/* 编辑集团 */}
      <EditCustomModal
        open={isopen}
        title={selectId == 'update' ? '编辑集团信息' : '新建集团'}
        onOk={onOk}
        currentGroup={currentGroup}
        handleOk={handleOk}
        handleCancel={handleCancel}
        selectId={selectId}
      />
      {/* <IndentityManage open = {isOpenIndentity} object = {currentGroup!} MemberData = {}/> */}
      <Modal
        title="添加单位"
        open={isAddOpen}
        onOk={handlePullOk}
        onCancel={handlePullCancel}
        destroyOnClose={true}
        width={500}>
        <div>
          <SearchCompany
            joinKey={joinKey}
            setJoinKey={setJoinKey}
            setJoinTarget={setJoinTarget}></SearchCompany>
        </div>
      </Modal>
      <Modal
        title="查看申请记录"
        destroyOnClose={true}
        open={isLookApplyOpen}
        onOk={handleApplyOk}
        onCancel={handleApplyCancel}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="ok" type="primary" onClick={handleApplyOk}>
            知道了
          </Button>,
        ]}
        width={900}>
        <div>
          <ApplyInfoService />
        </div>
      </Modal>
      {/* 左侧树 */}
      {treeContainer
        ? ReactDOM.createPortal(
            <TreeLeftGroupPage
              createTitle="新增"
              setCurrent={setTreeCurrent}
              handleMenuClick={handleMenuClick}
              currentKey={''}
            />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default SettingGroup;
