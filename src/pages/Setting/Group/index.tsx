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
import GroupTree from './components/TreeLeftGroupPage';
import { schema } from '@/ts/base';
import EditCustomModal from './components/EditCustomModal';
import { IGroup, ITarget } from '@/ts/core/target/itarget';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import ApplyInfoService from '@/bizcomponents/MyCompanySetting/ApplyInfo';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PageCard from '@/components/PageCard';
import IndentityManage from '@/bizcomponents/Indentity';
import { PageRequest } from '@/ts/base/model';

/**
 * 集团设置
 * @returns
 */
const SettingGroup: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const [current, setCurrent] = useState<ITarget>();
  const treeContainer = document.getElementById('templateMenu');
  const parentRef = useRef<any>(null); //父级容器Dom

  const [isopen, setIsOpen] = useState<boolean>(false); // 新增编辑集团
  const [activeModal, setActiveModal] = useState<string>(''); // 模态框
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  const [joinKey, setJoinKey] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [joinTarget, setJoinTarget] = useState<schema.XTarget>();

  useEffect(() => {
    if (!userCtrl.isCompanySpace) {
      history.push('/setting/info', { refresh: true });
    }
  }, []);

  // 选中树的时候操作
  const setTreeCurrent = (current: ITarget | undefined) => {
    if (current) {
      setCurrent(current);
    } else {
      setCurrent(undefined);
    }
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {
    switch (key) {
      case 'new':
        setIsOpen(true);
        setTitle('新建集团');
        break;
      case '新建集团':
        setCurrent(item);
        setTitle('新建子组织');
        setIsOpen(true);
        break;
      case '刷新':
        setCurrent(item);
        current?.loadSubTeam(true);
        break;
      case '删除':
        deleteGroup();
        break;
      case 'updateGroup':
        break;
    }
  };

  const onOk = () => {
    setIsOpen(false);
    setLookApplyOpen(false);
  };

  const handlePullOk = async () => {
    setActiveModal('');
    if (joinKey.length > 0 && current) {
      await current.pullMembers([joinKey], TargetType.Company);
    }
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

  const deleteGroup = async () => {
    if (current) {
      Modal.confirm({
        title: '确认',
        icon: <ExclamationCircleOutlined />,
        content: `删除集团${current.name}？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          if (await (current as IGroup).delete()) {
            message.info(`删除成功！`);
            userCtrl.changCallback();
          }
        },
      });
    }
  };

  const handleOk = async (item: any) => {
    if (item) {
      item.teamCode = item.code;
      item.teamName = item.name;
      item.typeName = TargetType.Group;
      if (title == '编辑') {
        if (userCtrl.isCompanySpace && current) {
          const group = await current.update(item);
          if (group) {
            message.info('修改集团成功！');
            userCtrl.changCallback();
            setIsOpen(false);
          }
        }
      } else if (title == '新建集团') {
        if (await userCtrl.company.createGroup(item)) {
          message.info('创建集团成功！');
          userCtrl.changCallback();
          setIsOpen(false);
        }
      } else if (title == '新建子组织') {
        if (await (current as IGroup).createSubGroup(item)) {
          message.info('创建集团成功！');
          userCtrl.changCallback();
          setIsOpen(false);
        }
      }
    }
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
  const titlePanel = (
    <div className={cls['company-group-title']}>
      <div>
        <Title level={4}>节点信息</Title>
      </div>
      <div>
        <Button
          type="link"
          onClick={() => {
            if (current) {
              setTitle('编辑');
              setIsOpen(true);
            }
          }}>
          编辑
        </Button>
        <Button
          type="link"
          onClick={() => {
            deleteGroup();
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
          title={titlePanel}
          bordered
          column={2}
          labelStyle={{ textAlign: 'center', color: '#606266' }}
          contentStyle={{ textAlign: 'center', color: '#606266' }}>
          <Descriptions.Item label="集团名称" contentStyle={{ width: '30%' }}>
            <strong>{current?.target.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="集团编码" contentStyle={{ width: '30%' }}>
            {current?.target.code}
          </Descriptions.Item>
          <Descriptions.Item label="创建人">
            {current?.target.createUser}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {current?.target.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {current?.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );

  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button type="link" onClick={() => setActiveModal('indentity')}>
          身份设置
        </Button>
        <Button type="link" onClick={() => setActiveModal('addCompany')}>
          添加成员
        </Button>
        <Button type="link" onClick={() => history.push('/todo/org')}>
          查看申请
        </Button>
      </Space>
    );
  };
  return (
    <div className={cls[`group-content-box`]}>
      {/* 编辑集团 */}
      {current ? (
        <>
          {content}
          <EditCustomModal
            open={isopen}
            onOk={onOk}
            current={current}
            handleOk={handleOk}
            handleCancel={handleCancel}
            title={title}
          />
          <IndentityManage
            open={activeModal === 'indentity'}
            current={current}
            onCancel={() => setActiveModal('')}
          />
          <div className={cls['pages-wrap']}>
            <PageCard
              bordered={false}
              tabList={TitleItems}
              onTabChange={(key) => {}}
              bodyStyle={{ paddingTop: 16 }}>
              <div className={cls['page-content-table']} ref={parentRef}>
                <Tabs
                  items={[{ label: `全部`, key: '1' }]}
                  tabBarExtraContent={renderBtns()}
                />
                <CardOrTable<schema.XTarget>
                  param={current}
                  rowKey={'id'}
                  dataSource={[]}
                  request={async (page: PageRequest) => {
                    return await current.loadMembers(page);
                  }}
                  operation={renderOperation}
                  columns={columns}
                  parentRef={parentRef}
                  showChangeBtn={false}
                />
              </div>
            </PageCard>
          </div>
        </>
      ) : (
        ''
      )}
      <Modal
        title="添加单位"
        open={activeModal === 'addCompany'}
        onOk={handlePullOk}
        onCancel={() => setActiveModal('')}
        destroyOnClose={true}
        width={500}>
        <div>
          <SearchCompany joinKey={joinKey} setJoinKey={setJoinKey}></SearchCompany>
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
            <GroupTree
              current={current}
              setCurrent={setTreeCurrent}
              handleMenuClick={handleMenuClick}
            />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default SettingGroup;
