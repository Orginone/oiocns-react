/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Descriptions, Space, message, Modal, Tabs } from 'antd';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { columns } from './config';
import { RouteComponentProps } from 'react-router-dom';
import TreeLeftGroupPage from './components/TreeLeftGroupPage';
import { schema, model } from '@/ts/base';
import EditCustomModal from './components/EditCustomModal';
import { IGroup } from '@/ts/core/target/itarget';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import ApplyInfoService from '@/bizcomponents/MyCompanySetting/ApplyInfo';
import SearchCompany from '@/bizcomponents/SearchCompany';
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

  const [isopen, setIsOpen] = useState<boolean>(false); // 新增编辑部门
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加单位
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请

  const [currentGroup, setCurrentGroup] = useState<IGroup>(); // 选中部门
  const [dataSource, setDataSource] = useState<schema.XTarget[]>([]); // 单位的分页
  const [selectId, setSelectId] = useState<string>(''); // 操作内容
  const [joinKey, setJoinKey] = useState<string>(''); // 选中的单位
  const [joinTarget, setJoinTarget] = useState<schema.XTarget>();

  useEffect(() => {
    if (!userCtrl.isCompanySpace) {
      history.push('/setting/info', { refresh: true });
    }
  }, []);

  // 选中树的时候操作
  const setTreeCurrent = (current: IGroup | undefined) => {
    if (current) {
      setCurrentGroup(current);
      currentGroup
        ?.loadMembers({
          offset: 1,
          limit: 10,
          filter: '',
        })
        .then((e) => {
          if (e && e.result) {
            setDataSource(e.result);
          } else {
            setDataSource([]);
          }
        });
    } else {
      setCurrentGroup(undefined);
      setDataSource([]);
    }
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {
    switch (key) {
      case 'new':
        setSelectId('new');
        setIsOpen(true);
        break;
      case '新增集团':
        setCurrentGroup(item.target);
        setIsOpen(true);
        setSelectId('second');
        break;
      case '刷新':
        item.target.loadSubTeam(true);
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
      // console.log
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
    if (item) {
      if (item.selectId == 'update') {
        if (userCtrl.isCompanySpace && currentGroup) {
          item.teamCode = item.code;
          item.teamName = item.name;
          item.typeName = TargetType.Group;
          const group = await currentGroup.update(item);
          if (group) {
            message.info('修改部门成功！');
            userCtrl.changCallback();
            setIsOpen(false);
          }
        }
      } else {
        item.teamCode = item.code;
        item.teamName = item.name;
        item.typeName = TargetType.Group;
        if (selectId === 'second') {
          const group = await currentGroup?.createSubGroup(item);
          if (group) {
            message.info('创建部门成功！');
            userCtrl.changCallback();
            setIsOpen(false);
          }
        } else if (selectId === 'new') {
          const group = await userCtrl.company.createGroup(item);
          if (group) {
            message.info('创建部门成功！');
            userCtrl.changCallback();
            setIsOpen(false);
          }
        }
      }
    }
    setIsAddOpen(false);
    setLookApplyOpen(false);
    setIsOpen(false);
  };

  // 操作内容渲染函数
  const renderOperation = (item: schema.XTarget): common.OperationType[] => {
    return [
      {
        key: 'changeNode',
        label: '调整节点',
        onClick: () => {},
      },
      {
        key: 'share',
        label: '岗位集团',
        onClick: () => {},
      },
      {
        key: 'remove',
        label: '移出集团',
        onClick: () => {},
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
                content: '删除集团？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  if (currentGroup) {
                    const isSuccess = await currentGroup.delete();
                    const operate = '删除集团';
                    if (isSuccess) {
                      message.info(`${operate}成功！`);
                      userCtrl.changCallback();
                    } else {
                      message.error(`${operate}失败！`);
                    }
                  }
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
