import React, { useState } from 'react';
import { ISpecies } from '@/ts/core';
import { Button, Spin, message } from 'antd';
import { schema } from '@/ts/base';
import PageCard from '@/components/PageCard';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import SpeciesItemModal from './itemModal';
import EntityInfo from '@/components/Common/EntityInfo';
import FullScreenModal from '@/components/Common/fullScreen';
import { SpeciesItemColumn } from '@/config/column';
import useAsyncLoad from '@/hooks/useAsyncLoad';

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
  const [loaded] = useAsyncLoad(async () => {
    await current.loadItems(true);
    tforceUpdate();
  });
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
          await current.hardDeleteItem(item);
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

  console.log(current.items);
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
        <Spin spinning={!loaded}>
          <CardOrTable<schema.XSpeciesItem>
            key={tkey}
            rowKey={'id'}
            dataSource={current.items}
            operation={renderOperate}
            columns={SpeciesItemColumn}
          />
        </Spin>
      </PageCard>
      {loadSpeciesItemModal()}
    </FullScreenModal>
  );
};

export default SpeciesModal;
