import ReactDOM from 'react-dom';
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Descriptions, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { columns } from './config';
import { dataSource } from './datamock';
import type * as schema from '@/ts/base/schema';
import EditCustomModal from './components/EditCustomModal';
import AddPersonModal from './components/AddPersonModal';
import AddPostModal from '@/bizcomponents/AddPositionModal';
import TransferDepartment from './components/TransferDepartment';
import LookApply from './components/LookApply';
import { initDatatype } from '@/ts/core/setting/isetting';
import userCtrl from '@/ts/controller/setting/userCtrl';
import TreeLeftDeptPage from './components/TreeLeftDeptPage/Creategroup';

/**
 * 部门设置
 * @returns
 */
const SettingDept: React.FC = () => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加成员
  const [isSetPost, setIsSetPost] = useState<boolean>(false); // 岗位设置
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>();
  const [isCreateDept, setIsCreateDept] = useState<boolean>(false);
  const [Transfer, setTransfer] = useState<boolean>(false); //变更部门

  const [SelectDept, setSelectDept] = useState<schema.XTarget>();
  const treeContainer = document.getElementById('templateMenu');
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
        label: '部门设置',
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
      case '新增部门':
        setIsCreateDept(true);
        setIsOpenModal(true);
        setSelectId(item.id);
        break;
      case 'changeDept': //变更部门
        setIsOpenModal(true);
        setSelectDept(item);
        setSelectId(item.id);
    }
  };
  /** 添加人员的逻辑 */
  const onPersonalOk = (params: initDatatype[]) => {
    console.log(params);
    setIsAddOpen(false);
  };

  /** 设置岗位的逻辑 */
  // const handlePostOk = (checkJob: initDatatype, checkUser: initDatatype[]) => {
  //   console.log(checkJob, checkUser);
  //   setIsSetPost(false);
  // };

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
  };
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {
    initData();
    // 刚进入的时候选中公司 TODO
    // setSelectDept();
  }, []);

  useEffect(() => {
    initData();
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
    {
      tab: `已开通`,
      key: '2',
    },
    {
      tab: `未开通`,
      key: '3',
    },
  ];

  // 部门信息标题
  const title = (
    <div className={cls['company-dept-title']}>
      <div>
        <Title level={4}>部门信息</Title>
      </div>
      <div>
        <Button type="link" onClick={() => {}}>
          编辑
        </Button>
        <Button type="link">权限管理</Button>
      </div>
    </div>
  );

  /**
   * @description: 部门信息内容
   * @return {*}
   */
  const content = (
    <div className={cls['company-dept-content']}>
      <Card bordered={false}>
        <Descriptions title={title} bordered column={2}></Descriptions>
      </Card>
    </div>
  );
  // 按钮
  const renderBtns = () => {
    return (
      <Space>
        <Button
          type="link"
          onClick={() => {
            setIsSetPost(true);
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
            title={userCtrl.Space?.target.name}
            className={cls['app-tabs']}
            extra={renderBtns()}
            tabList={items}
            onTabChange={(key) => {
              setStatusKey(key);
              console.log('切换事件', key);
            }}
          />
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
      <AddPostModal title={'身份设置'} open={isSetPost} onOk={onOk} handleOk={onOk} />
      {/* 左侧树 */}
      {treeContainer
        ? ReactDOM.createPortal(
            <TreeLeftDeptPage
              createTitle="新增"
              setCurrent={setSelectDept}
              handleMenuClick={handleMenuClick}
            />,
            treeContainer,
          )
        : ''}
    </div>
  );
};

export default SettingDept;
function setIsSetPost(arg0: boolean) {
  throw new Error('Function not implemented.');
}
