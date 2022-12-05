import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Descriptions, Space } from 'antd';
import { columns } from './config';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import type * as schema from '@/ts/base/schema';
import EditCustomModal from './components/EditCustomModal';
import AddPersonModal from './components/AddPersonModal';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import TransferDepartment from './components/TransferDepartment';
import LookApply from './components/LookApply';
import { initDatatype } from '@/ts/core/setting/isetting';
import TreeLeftDeptPage from './components/TreeLeftDeptPage';
import SettingService from './service';
import Department from '@/ts/core/target/department';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { RouteComponentProps } from 'react-router-dom';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import IndentityModal from '@/bizcomponents/Indentity/index';

/**
 * 内设机构
 * @returns
 */
const SettingDept: React.FC<RouteComponentProps> = ({ history }) => {
  const setting = SettingService.getInstance();
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加成员
  const [isSetPost, setIsSetPost] = useState<boolean>(false); // 岗位设置
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>();
  const [isCreateDept, setIsCreateDept] = useState<boolean>(false);
  const [Transfer, setTransfer] = useState<boolean>(false); //变更部门
  const [dataSource, setDataSource] = useState<schema.XTarget[]>([]); //部门成员
  const [SelectDept, setSelectDept] = useState<schema.XTarget>();
  const [authorityTree, setAuthorityTree] = useState<IAuthority>();
  const [isOpenIndentity, setIsOpenIndentity] = useState<boolean>(false);
  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'publish',
        label: '修改信息',
        onClick: () => {
          console.log('按钮事件', 'publish', item);
        },
      },
      {
        key: 'changeDept',
        label: '变更部门',
        onClick: () => {
          // console.log('按钮事件', 'share', item);
          setTransfer(true);
        },
      },
      {
        key: 'detail',
        label: '岗位设置',
        onClick: () => {
          setIsSetPost(true);
          // console.log('按钮事件', 'detail', item);
        },
      },
      {
        key: 'publishList',
        label: '内设机构',
        onClick: () => {
          console.log('按钮事件', 'publishList', item);
        },
      },
      {
        key: 'caption',
        label: '停用',
        onClick: () => {
          console.log('按钮事件', 'publishList', item);
        },
      },
      {
        key: 'caption1',
        label: '移出部门',
        onClick: () => {
          console.log('按钮事件', 'publishList', item);
        },
      },
    ];
  };

  /**点击操作内容触发的事件 */
  const handleMenuClick = (key: string, item: any) => {
    switch (key) {
      case 'new':
        setting.setCurrTreeDeptNode('');
        setIsCreateDept(true);
        setIsOpenModal(true);
        break;
      case '新增部门':
        setIsCreateDept(true);
        setIsOpenModal(true);
        setSelectId(item.target.target.id);
        setting.setCurrTreeDeptNode(item.target.target.id);
        break;
      case 'changeDept': //变更部门
        setIsOpenModal(true);
        setSelectDept(item);
        break;
      case 'updateDept':
        setIsCreateDept(true);
        setIsOpenModal(true);
        setSelectId(item.id);
        setting.setCurrTreeDeptNode(item.id);
        break;
    }
  };

  // 选中树的时候操作
  const setTreeCurrent = (current: schema.XTarget) => {
    setSelectDept(current);
    setSelectId(current.id);
    setting.setCurrTreeDeptNode(current.id);
    const dept = new Department(current);
    dept.getPerson().then((e) => {
      setDataSource(e);
    });
    dept.selectAuthorityTree(false).then((auths) => {
      if (auths) {
        setAuthorityTree(auths);
      }
    });
  };

  /** 添加人员的逻辑 */
  const onPersonalOk = (params: initDatatype[]) => {
    console.log(params);
    setIsAddOpen(false);
  };

  const onApplyOk = () => {
    setLookApplyOpen(false);
  };

  const onOk = () => {
    setIsAddOpen(false);
    setIsSetPost(false);
    setTransfer(false);
    setLookApplyOpen(false);
    setIsOpenModal(false);
    setIsCreateDept(false);
  };

  const handleOk = () => {
    setIsAddOpen(false);
    setIsSetPost(false);
    setTransfer(false);
    setLookApplyOpen(false);
    setIsOpenModal(false);
    setIsCreateDept(false);
    // 处理刷新的功能
    userCtrl.changCallback();
  };
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {
    if (!userCtrl.IsCompanySpace) {
      history.push('/setting/info', { refresh: true });
    } else {
      initData();
      // 刚进入的时候选中公司 TODO
      setting.setCompanyID = userCtrl?.Company?.target.id + '';
      setting.setRoot = userCtrl?.Company!.target;
    }
  }, ['', userCtrl?.Company]);

  useEffect(() => {
    setting.setCompanyID = userCtrl?.Company?.target.id ?? '';
  }, [selectId]);

  const initData = async () => {};

  // 标题tabs页
  const TitleItems = [
    {
      tab: `部门成员`,
      key: 'deptPerpeos',
    },
    {
      tab: `部门应用`,
      key: 'deptApps',
    },
  ];

  // tabs页
  const items = [
    {
      tab: `全部`,
      key: '1',
    },
  ];

  // 部门信息标题
  const title = (
    <div className={cls['company-dept-title']}>
      <div>
        <Title level={4}>部门信息</Title>
      </div>
      <div>
        <Button
          type="link"
          onClick={() => {
            handleMenuClick('updateDept', SelectDept);
          }}>
          编辑
        </Button>
        <Button type="link">权限管理</Button>
        <Button
          type="link"
          onClick={() => {
            setIsOpenIndentity(true);
          }}>
          岗位设置
        </Button>
      </div>
    </div>
  );

  /**
   * @description: 部门信息内容
   * @return {*}
   */
  const content = (
    // <div >
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={title}
        bordered
        column={2}
        labelStyle={{ textAlign: 'center' }}
        contentStyle={{ textAlign: 'center' }}>
        <Descriptions.Item label="部门名称">{SelectDept?.name || ''}</Descriptions.Item>
        <Descriptions.Item label="部门编码">{SelectDept?.code || ''}</Descriptions.Item>
        <Descriptions.Item label="创建人">
          {SelectDept?.createUser || ''}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {SelectDept?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {SelectDept?.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
    // </div>
  );
  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button
          type="link"
          onClick={() => {
            if (authorityTree) {
              setIsSetPost(true);
            }
          }}>
          身份设置
        </Button>
        <Button
          type="link"
          onClick={() => {
            setIsAddOpen(true);
          }}>
          添加成员
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
  //部门主体
  const deptCount = (
    <div className={`${cls['dept-wrap-pages']}`}>
      <Card tabList={TitleItems}>
        <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
          <Card
            title={userCtrl?.Company?.target?.name}
            className={cls['app-tabs']}
            extra={renderBtns()}
            tabList={items}
            onTabChange={(key) => {
              setStatusKey(key);
              console.log('切换事件', key);
            }}>
            <div className={cls['page-content-table']} ref={parentRef}>
              <CardOrTable
                dataSource={dataSource as any}
                rowKey={'id'}
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
    <div className={cls[`dept-content-box`]}>
      {content}
      {deptCount}
      {/* 编辑部门 */}
      <EditCustomModal
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        selectId={selectId}
        open={isOpenModal}
        title={isCreateDept ? '新增' : '编辑'}
        onOk={onOk}
        handleOk={handleOk}
      />
      {/* 添加成员 */}
      <AddPersonModal
        title={'添加成员'}
        open={isAddOpen}
        onOk={onPersonalOk}
        handleOk={handleOk}
      />
      {/* 查看申请 */}
      <LookApply
        title={'查看申请'}
        open={isLookApplyOpen}
        onOk={onApplyOk}
        handleOk={handleOk}
      />
      {/* 变更部门 */}
      <TransferDepartment
        title={'转移部门'}
        open={Transfer}
        onOk={onOk}
        handleOk={handleOk}
      />

      {/* 对象设置 */}
      <AddPostModal
        title={'身份设置'}
        open={isSetPost}
        onOk={() => {
          setIsSetPost(false);
        }}
        handleOk={() => {
          setIsSetPost(false);
        }}
        datasource={authorityTree}
      />
      {/* 左侧树 */}
      <TreeLeftDeptPage
        createTitle="新增"
        setCurrent={setTreeCurrent}
        handleMenuClick={handleMenuClick}
        currentKey={''}
      />
      <IndentityModal open={isOpenIndentity} onCancel={() => setIsOpenIndentity(false)} />
    </div>
  );
};

export default SettingDept;
