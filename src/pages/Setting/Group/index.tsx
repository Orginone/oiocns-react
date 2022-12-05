/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom';
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Descriptions, Space, message } from 'antd';
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
import { IGroup } from '@/ts/core/target/itarget';
import Group from '@/ts/core/target/group';
import { XTarget } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { TargetType } from '@/ts/core/enum';
import { getUuid } from '@/utils/tools';
/**
 * 集团设置
 * @returns
 */
const SettingGroup: React.FC<RouteComponentProps> = (props) => {
  const treeContainer = document.getElementById('templateMenu');

  const parentRef = useRef<any>(null); //父级容器Dom
  const [isopen, setIsOpen] = useState<boolean>(false); // 编辑
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加单位
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  const [statusKey, setStatusKey] = useState('merchandise');
  const [currentGroup, setCurrentGroup] = useState<IGroup>();

  const [dataSource, setDataSource] = useState<XTarget[]>();
  const [id, setId] = useState<string>('');
  const [groupModalID, setGroupModalID] = useState<string>('');
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {}, []);

  // 选中树的时候操作
  const setTreeCurrent = (current: schema.XTarget) => {
    setId(current.id);
    setCurrentGroup(new Group(current));
    currentGroup?.getCompanys(false).then((e) => {
      setDataSource(e);
    });
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {
    console.log(key, item, '====');
    switch (key) {
      case 'new':
        setGroupModalID(getUuid());
        setId('');
        setIsOpen(true);
        break;
      case '新增集团':
        setGroupModalID(getUuid());
        setId(item.target.target.id);
        setCurrentGroup(item.target);
        setIsOpen(true);
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

  const handleOk = async (item: any) => {
    // 新增
    if (item) {
      console.log(item);
      // currentGroup?.createSubGroup
      if (userCtrl.IsCompanySpace) {
        item.teamCode = item.code;
        item.teamName = item.name;

        item.typeName = TargetType.Group;
        if (id != '') {
          item.belongId = id;
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
    } else {
      setIsAddOpen(false);
      setLookApplyOpen(false);
      setIsOpen(false);
    }
  };
  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
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
            setIsOpen(true);
          }}>
          编辑
        </Button>
        <Button type="link">删除</Button>
      </div>
    </div>
  );
  // 集团信息内容
  const content = (
    <div className={cls['company-group-content']}>
      <Card bordered={false}>
        <Descriptions title={title} bordered column={2}>
          <Descriptions.Item label="集团名称">
            {currentGroup?.target.name}
          </Descriptions.Item>
          <Descriptions.Item label="集团编码">
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
            setIsAddOpen(false);
          }}>
          添加单位
        </Button>
        <Button
          type="link"
          onClick={() => {
            setLookApplyOpen(true);
          }}>
          查看申请
        </Button>
      </Space>
    );
  };
  //集团主体
  const deptCount = (
    <div className={`${cls['group-wrap-pages']}`}>
      <Card>
        <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
          <Card
            title={currentGroup?.target.name}
            className={cls['app-tabs']}
            extra={renderBtns()}
            onTabChange={(key) => {
              setStatusKey(key);
              console.log('切换事件', key);
            }}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={dataSource as any}
                rowKey={'key'}
                operation={renderOperation}
                columns={columns as any}
                parentRef={parentRef}
                showChangeBtn={false}
              />
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
  return (
    <div className={cls[`group-content-box`]}>
      {content}
      {deptCount}
      {/* 编辑集团 */}
      <EditCustomModal
        open={isopen}
        title={id ? '请编辑集团信息' : '新建集团'}
        onOk={onOk}
        handleCancel={handleOk}
        handleOk={handleOk}
      />

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
