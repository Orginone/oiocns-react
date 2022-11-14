/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { Card, Button, Descriptions, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import { columns } from './config';
import { dataSource } from './datamock';
import EditCustomModal from '../Dept/components/EditCustomModal';
import AddPersonModal from '../Dept/components/AddPersonModal';

/**
 * 集团设置
 * @returns
 */
const SettingGroup: React.FC = () => {
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isopen, setIsOpen] = useState<boolean>(false); // 编辑
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false); // 添加单位
  const [statusKey, setStatusKey] = useState('merchandise');
  const onOk = () => {
    setIsOpen(false);
    setIsAddOpen(false);
  };
  const handleOk = () => {
    setIsOpen(false);
    setIsAddOpen(false);
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
          <Descriptions.Item label="集团名称">浙江省财政厅</Descriptions.Item>
          <Descriptions.Item label="集团编码">1130010101010101010</Descriptions.Item>
          <Descriptions.Item label="我的岗位">浙江省财政厅-管理员</Descriptions.Item>
          <Descriptions.Item label="团队编码">zjczt</Descriptions.Item>
          <Descriptions.Item label="创建人">小明</Descriptions.Item>
          <Descriptions.Item label="创建时间">2022-11-01 11:11:37</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            未公示
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
            setIsAddOpen(true);
          }}>
          添加单位
        </Button>
        <Button type="link">查看申请</Button>
      </Space>
    );
  };
  //部门主体
  const deptCount = (
    <div className={`${cls['group-wrap-pages']}`}>
      <Card tabList={TitleItems}>
        <div className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
          <Card
            title="浙江省资产年报集团"
            className={cls['app-tabs']}
            extra={renderBtns()}
            onTabChange={(key) => {
              setStatusKey(key);
              console.log('切换事件', key);
            }}
          />
          <div className={cls['page-content-table']} ref={parentRef}>
            <CardOrTable
              dataSource={dataSource as any}
              rowKey={'key'}
              operation={renderOperation}
              columns={columns as any}
              parentRef={parentRef}
            />
          </div>
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
        title={'请编辑集团信息'}
        onOk={onOk}
        handleOk={handleOk}
      />
      {/* 添加单位 */}
      <AddPersonModal
        title={'搜索单位'}
        open={isAddOpen}
        onOk={onOk}
        handleOk={handleOk}
        columns={columns}
      />
    </div>
  );
};

export default SettingGroup;
