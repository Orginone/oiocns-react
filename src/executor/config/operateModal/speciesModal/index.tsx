/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ISpecies } from '@/ts/core';
import { Button, message } from 'antd';
import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-table';
import PageCard from '@/components/PageCard';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import SpeciesItemModal from './itemModal';
import EntityInfo from '@/bizcomponents/EntityInfo';
import FullScreenModal from '@/executor/tools/fullScreen';

type IProps = {
  current: ISpecies;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const SpeciesModal: React.FC<IProps> = ({ current, finished }) => {
  const [activeModel, setActiveModel] = useState<string>('');
  const [item, setItem] = useState<schema.XSpeciesItem>();
  const [tkey, tforceUpdate] = useObjectUpdate(current);

  const renderBtns = () => {
    return (
      <Button type="link" onClick={() => setActiveModel('新增')}>
        {'新增' + current.typeName + '项'}
      </Button>
    );
  };
  // 操作内容渲染函数
  const renderOperate = (item: schema.XSpeciesItem) => {
    const operates = [
      {
        key: `编辑${current.typeName}项`,
        label: `编辑${current.typeName}项`,
        onClick: () => {
          setItem(item);
          setActiveModel('编辑');
        },
      },
      {
        key: `删除${current.typeName}项`,
        label: <span style={{ color: 'red' }}>{`删除${current.typeName}项`}</span>,
        onClick: async () => {
          await current.deleteItem(item);
          tforceUpdate();
        },
      },
    ];
    if (current.typeName != '字典') {
      operates.unshift({
        key: `新增${current.typeName}子项`,
        label: `新增${current.typeName}子项`,
        onClick: () => {
          setItem(item);
          setActiveModel('新增');
        },
      });
    }
    return operates;
  };
  const TitleItems = [
    {
      tab: `${current.typeName}项`,
      key: 'Items',
    },
  ];

  const columns: ProColumns<schema.XSpeciesItem>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 50,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 200,
    },
    {
      title: '信息',
      dataIndex: 'info',
      key: 'info',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '归属组织',
      dataIndex: 'belongId',
      editable: false,
      key: 'belongId',
      width: 200,
      render: (_, record) => {
        return <EntityIcon entityId={record.belongId} showName />;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      editable: false,
      key: 'createUser',
      width: 150,
      render: (_, record) => {
        return <EntityIcon entityId={record.createUser} showName />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      editable: false,
    },
  ];

  const loadSpeciesItemModal = () => {
    return activeModel == '新增' || (activeModel == '编辑' && item != undefined) ? (
      <SpeciesItemModal
        open
        data={item}
        current={current}
        typeName={current.typeName}
        operateType={activeModel}
        handleCancel={() => {
          setActiveModel('');
          setItem(undefined);
        }}
        handleOk={(success: boolean) => {
          if (success) {
            message.success('操作成功');
            setItem(undefined);
            setActiveModel('');
            tforceUpdate();
          }
        }}
      />
    ) : (
      <></>
    );
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '项管理'}
      onCancel={() => finished()}
      footer={[]}>
      <EntityInfo entity={current}></EntityInfo>
      <PageCard
        className={cls[`card-wrap`]}
        bordered={false}
        tabList={TitleItems}
        onTabChange={(_: any) => {}}
        tabBarExtraContent={renderBtns()}>
        <CardOrTable<schema.XSpeciesItem>
          key={tkey}
          dataSource={current.items}
          rowKey={'id'}
          operation={renderOperate}
          columns={columns}
        />
      </PageCard>
      {loadSpeciesItemModal()}
    </FullScreenModal>
  );
};

export default SpeciesModal;
