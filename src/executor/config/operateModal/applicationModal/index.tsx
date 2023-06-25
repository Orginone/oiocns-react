/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { IApplication, IWork } from '@/ts/core';
import { Button, message } from 'antd';
import WorkModal from './workModal';
import PageCard from '@/components/PageCard';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import EntityInfo from '@/components/Common/EntityInfo';
import FlowDesign from '@/components/Common/FlowDesign';
import FullScreenModal from '@/executor/tools/fullScreen';
import { WorkColumn } from '@/config/column';

type IProps = {
  current: IApplication;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const ApplicationModal: React.FC<IProps> = ({ current, finished }) => {
  const [work, setWork] = useState<IWork>();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const renderBtns = () => {
    return (
      <Button type="link" onClick={() => setActiveModel('新增')}>
        新增办事定义
      </Button>
    );
  };
  // 操作内容渲染函数
  const renderOperate = (item: IWork) => {
    return [
      {
        key: `编辑`,
        label: `编辑办事定义`,
        onClick: () => {
          setWork(item);
          setActiveModel('编辑');
        },
      },
      {
        key: `设计`,
        label: `设计办事定义`,
        onClick: () => {
          setWork(item);
          setActiveModel('设计');
        },
      },
      {
        key: `删除`,
        label: <span style={{ color: 'red' }}>删除办事定义</span>,
        onClick: async () => {
          if (await item.delete()) {
            tforceUpdate();
          }
        },
      },
    ];
  };
  const TitleItems = [
    {
      tab: `办事定义`,
      key: 'Items',
    },
  ];

  const loadWorkNodal = () => {
    switch (activeModel) {
      case '新增':
      case '编辑':
        return (
          <WorkModal
            open
            application={current}
            current={work}
            handleCancel={() => {
              setActiveModel('');
              setWork(undefined);
            }}
            handleOk={(success: boolean) => {
              if (success) {
                message.success('操作成功');
                setWork(undefined);
                setActiveModel('');
                tforceUpdate();
              }
            }}
          />
        );
      default:
        if (work) {
          return (
            <FullScreenModal
              centered
              fullScreen
              destroyOnClose
              footer={[]}
              open={activeModel == '设计'}
              width="80vw"
              okText="发布"
              cancelText="取消"
              title={`事项[${work.name}]设计`}
              onSave={() => setIsSave(true)}
              onCancel={() => setWork(undefined)}>
              <FlowDesign
                current={work}
                onSave={isSave}
                onSaveFinished={(success) => {
                  if (success) {
                    message.info('保存成功');
                    setWork(undefined);
                  }
                  setIsSave(false);
                }}
              />
            </FullScreenModal>
          );
        }
        return <></>;
    }
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '项管理'}
      footer={[]}
      onCancel={finished}>
      <EntityInfo entity={current}></EntityInfo>
      <PageCard
        className={cls[`card-wrap`]}
        bordered={false}
        tabList={TitleItems}
        onTabChange={(_: any) => {}}
        tabBarExtraContent={renderBtns()}>
        <CardOrTable<IWork>
          rowKey={'id'}
          params={tkey}
          dataSource={current.works}
          operation={renderOperate}
          columns={WorkColumn}
        />
      </PageCard>
      {loadWorkNodal()}
    </FullScreenModal>
  );
};

export default ApplicationModal;
