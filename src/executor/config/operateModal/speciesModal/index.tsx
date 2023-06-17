/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ISpecies } from '@/ts/core';
import { Button, Modal, message } from 'antd';
import { schema } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-table';
import PageCard from '@/components/PageCard';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import SpeciesItemModal from './speciesItem';

type IProps = {
  current: ISpecies;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const SpeciesModal: React.FC<IProps> = ({ current, finished }) => {
  const [activeModel, setActiveModel] = useState<string>('');
  const [item, setDictItem] = useState<schema.XSpeciesItem>();
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
    return [
      {
        key: `编辑${current.typeName}项`,
        label: `编辑${current.typeName}项`,
        onClick: () => {
          setDictItem(item);
          setActiveModel('编辑');
        },
      },
      {
        key: `删除${current.typeName}项`,
        label: `删除${current.typeName}项`,
        onClick: async () => {
          await current.deleteItem(item);
          tforceUpdate();
        },
      },
    ];
  };
  const TitleItems = [
    {
      tab: `${current.typeName}项`,
      key: 'Items',
    },
  ];

  const columns: ProColumns<schema.XSpeciesItem>[] = [
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
      width: 150,
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
      width: 150,
      editable: false,
    },
  ];

  return (
    <Modal
      open
      width="100vw"
      style={{ maxWidth: '100vw', top: 0, paddingBottom: 0 }}
      bodyStyle={{ height: 'calc(100vh - 50px - 53px)', maxHeight: '100vh' }}
      title={current.typeName + '项管理'}
      footer={[]}
      onCancel={finished}
      destroyOnClose>
      <PageCard
        className={cls[`card-wrap`]}
        bordered={false}
        tabList={TitleItems}
        onTabChange={(_: any) => {}}
        tabBarExtraContent={renderBtns()}>
        <CardOrTable<schema.XSpeciesItem>
          dataSource={current.items}
          rowKey={'id'}
          params={tkey}
          operation={renderOperate}
          columns={columns}
          showChangeBtn={false}
        />
      </PageCard>
      <SpeciesItemModal
        typeName={current.typeName}
        open={activeModel == '新增' || (activeModel == '编辑' && item != undefined)}
        data={item}
        current={current}
        handleCancel={() => {
          setActiveModel('');
          setDictItem(undefined);
        }}
        handleOk={(success: boolean) => {
          if (success) {
            message.success('操作成功');
            setDictItem(undefined);
            setActiveModel('');
            tforceUpdate();
          }
        }}
      />
    </Modal>
  );
};

export default SpeciesModal;
