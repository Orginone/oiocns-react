/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IApplication, IWork } from '@/ts/core';
import { Button, message } from 'antd';
import WorkModal from './workModal';
import { ProColumns } from '@ant-design/pro-table';
import PageCard from '@/components/PageCard';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import EntityInfo from '@/bizcomponents/EntityInfo';
import FlowDesign from '@/bizcomponents/FlowDesign';
import FullScreenModal from '@/executor/config/tools/fullScreen';

type IProps = {
  current: IApplication;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const SpeciesModal: React.FC<IProps> = ({ current, finished }) => {
  const [work, setWork] = useState<IWork>();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<IWork[]>([]);
  const [activeModel, setActiveModel] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const renderBtns = () => {
    return (
      <Button type="link" onClick={() => setActiveModel('新增')}>
        新增办事定义
      </Button>
    );
  };
  useEffect(() => {
    setTimeout(async () => {
      setDataSource(await current.loadWorks());
      tforceUpdate();
    }, 10);
  }, [current]);
  // 操作内容渲染函数
  const renderOperate = (item: IWork) => {
    return [
      {
        key: `编辑`,
        label: `编辑`,
        onClick: () => {
          setWork(item);
          setActiveModel('编辑');
        },
      },
      {
        key: `设计`,
        label: `设计`,
        onClick: () => {
          setWork(item);
          setActiveModel('设计');
        },
      },
      {
        key: `删除`,
        label: `删除`,
        onClick: async () => {
          if (await item.deleteDefine()) {
            setDataSource(current.works);
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

  const columns: ProColumns<IWork>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 50,
    },
    {
      title: '办事名称',
      dataIndex: ['metadata', 'name'],
      key: 'name',
      width: 200,
    },
    {
      title: '办事标识',
      dataIndex: ['metadata', 'code'],
      key: 'code',
      width: 200,
    },
    {
      title: '允许新增',
      dataIndex: ['metadata', 'allowAdd'],
      key: 'allowAdd',
      width: 200,
      render: (_, record) => {
        return record.metadata.allowAdd ? '是' : '否';
      },
    },
    {
      title: '允许变更',
      dataIndex: ['metadata', 'allowEdit'],
      key: 'allowEdit',
      width: 200,
      render: (_, record) => {
        return record.metadata.allowEdit ? '是' : '否';
      },
    },
    {
      title: '允许选择',
      dataIndex: ['metadata', 'allowSelect'],
      key: 'allowSelect',
      width: 200,
      render: (_, record) => {
        return record.metadata.allowSelect ? '是' : '否';
      },
    },
    {
      title: '备注',
      dataIndex: ['metadata', 'remark'],
      key: 'remark',
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: ['metadata', 'createUser'],
      editable: false,
      key: 'createUser',
      width: 150,
      render: (_, record) => {
        return <EntityIcon entityId={record.metadata.createUser} showName />;
      },
    },
    {
      title: '创建时间',
      dataIndex: ['metadata', 'createTime'],
      key: 'createTime',
      width: 200,
      editable: false,
    },
  ];

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
          dataSource={dataSource}
          operation={renderOperate}
          columns={columns}
          showChangeBtn={false}
        />
      </PageCard>
      <WorkModal
        open={activeModel == '新增' || (activeModel == '编辑' && work != undefined)}
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
      {work && (
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
      )}
    </FullScreenModal>
  );
};

export default SpeciesModal;
