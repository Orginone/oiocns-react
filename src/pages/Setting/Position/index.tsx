/* eslint-disable no-unused-vars */
import { Card, Button, Descriptions, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { columns } from './config';
import { dataSource } from './datamock';
import EditCustomModal from './components/EditCustomModal';
import AddPersonModal from './components/AddPersonModal';
import AddDeptModal from './components/AddDeptModal';
import TransferDepartment from './components/TransferDepartment';
import LookApply from './components/LookApply';
import { initDatatype } from '@/ts/core/setting/isetting';

/** 获取角色当前名称 */
interface PositionBean {
  key: string;
  id: string;
  name: string;
  code: string;
  create: string;
  createTime: string;
  remark: string;
}

/**
 * 岗位设置
 * @returns
 */
const SettingDept: React.FC = () => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加成员
  const [isSetPost, setIsSetPost] = useState<boolean>(false); // 岗位设置
  const [isLookApplyOpen, setLookApplyOpen] = useState<boolean>(false); //查看申请
  const [statusKey, setStatusKey] = useState('merchandise');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>();
  const [isCreateDept, setIsCreateDept] = useState<boolean>(false);
  const [Transfer, setTransfer] = useState<boolean>(false);

  const [_currentPostion, setPosition] = useState<any>({});
  //变更岗位

  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'remove',
        label: '移除人员',
        onClick: () => {
          console.log('按钮事件', 'remove', item);
        },
      },
    ];
  };
  /** 添加人员的逻辑 */
  const onPersonalOk = (params: initDatatype[]) => {
    console.log(params);
    setIsAddOpen(false);
  };

  /** 设置岗位的逻辑 */
  const handlePostOk = (checkJob: initDatatype, checkUser: initDatatype[]) => {
    console.log(checkJob, checkUser);
    setIsSetPost(false);
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
  };
  const handleOk = () => {
    setIsAddOpen(false);
    setIsSetPost(false);
    setTransfer(false);
    setLookApplyOpen(false);
    setIsOpenModal(false);
  };
  /**
   * @description: 监听点击事件，关闭弹窗 订阅
   * @return {*}
   */
  useEffect(() => {
    settingController.addListen('isOpenModal', () => {
      setIsCreateDept(true);
      setIsOpenModal(true);
    });
    return settingController.remove('isOpenModal', () => {
      setIsOpenModal(false);
      setIsCreateDept(false);
    });
  }, []);

  useEffect(() => {
    settingController.addListen('isSetPost', () => {
      setIsSetPost(true);
    });
    return settingController.remove('isSetPost', () => {
      setIsSetPost(false);
    });
  }, []);

  /**
   * 监听集团id发生变化，改变右侧数据
   * */
  useEffect(() => {
    settingController.addListen('createPosition', (e: { id: string }) => {
      setIsCreateDept(true);
      setSelectId(e.id);
    });
    return settingController.remove('createPosition', () => {
      setSelectId('');
      setIsCreateDept(false);
    });
  }, []);

  useEffect(() => {
    initData();
  }, [selectId]);

  const initData = async () => {
    const resultData = await settingController.searchAllPersons(selectId);
    console.log(resultData);
  };

  // 标题tabs页
  const TitleItems = [
    {
      tab: `岗位成员`,
      key: 'deptPerpeos',
    },
    {
      tab: `岗位应用`,
      key: 'deptApps',
    },
  ];

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
            settingController.trigger('isOpenModal');
            setIsCreateDept(false);
          }}>
          编辑
        </Button>
        <Button type="link">删除</Button>
      </div>
    </div>
  );
  // 岗位信息内容
  const content = (
    <div className={cls['company-dept-content']}>
      <Card bordered={false}>
        <Descriptions title={title} bordered column={2}>
          <Descriptions.Item label="名称">管理员</Descriptions.Item>
          <Descriptions.Item label="编码">super-admin</Descriptions.Item>
          <Descriptions.Item label="创建人">小明</Descriptions.Item>
          <Descriptions.Item label="创建时间">2022-11-17 15:34:57</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            系统生成的对应组织的权责身份
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
          onClick={() => {
            console.log('指派岗位');
            settingController.trigger('isSetPost');
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
    </div>
  );
  return (
    <div className={cls[`dept-content-box`]}>
      {content}
      {deptCount}
      {/* 编辑单位 */}
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

      {/* 变更岗位 */}
      <TransferDepartment
        title={'转移岗位'}
        open={Transfer}
        onOk={onOk}
        handleOk={handleOk}
      />
      {/* 岗位设置 */}
      <AddDeptModal
        title={'岗位设置'}
        open={isSetPost}
        onOk={handlePostOk}
        handleOk={onOk}
      />
    </div>
  );
};

export default SettingDept;
