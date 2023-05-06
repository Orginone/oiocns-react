import PageCard from '@/components/PageCard';
import { XDictItem } from '@/ts/base/schema';
import { Button, Card, Descriptions, message } from 'antd';
import React, { useState } from 'react';
import { DictItemColumns } from '../../config/columns';
import CardOrTable from '@/components/CardOrTableComp';
import DictItemModal from './dictItemModal';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import cls from './index.module.less';
import { IDict } from '@/ts/core';
/**
 * @description: 分类字典管理
 * @return {*}
 */
const DictInfo: React.FC<any> = ({ current }: { current: IDict }) => {
  const [activeModel, setActiveModel] = useState<string>('');
  const [dictItem, setDictItem] = useState<XDictItem>();
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const renderBtns = () => {
    return (
      <Button type="link" onClick={() => setActiveModel('新增')}>
        新增字典项
      </Button>
    );
  };
  // 操作内容渲染函数
  const renderOperate = (item: XDictItem) => {
    return [
      {
        key: '编辑字典项',
        label: '编辑字典项',
        onClick: () => {
          setDictItem(item);
          setActiveModel('编辑');
        },
      },
      {
        key: '删除字典项',
        label: '删除字典项',
        onClick: async () => {
          await current.deleteItem(item);
          tforceUpdate();
        },
      },
    ];
  };
  const TitleItems = [
    {
      tab: `字典项`,
      key: 'dictItems',
    },
  ];

  return (
    <Card bordered={false}>
      <Descriptions
        size="middle"
        title="字典"
        bordered
        column={2}
        labelStyle={{
          textAlign: 'left',
          color: '#606266',
          width: 120,
        }}
        contentStyle={{ textAlign: 'left', color: '#606266' }}>
        <Descriptions.Item label="字典名称">{current.metadata.name}</Descriptions.Item>
        <Descriptions.Item label="字典代码">{current.metadata.code}</Descriptions.Item>
        <Descriptions.Item label="备注">{current.metadata.remark}</Descriptions.Item>
      </Descriptions>

      <PageCard
        className={cls[`card-wrap`]}
        bordered={false}
        tabList={TitleItems}
        onTabChange={(_: any) => {}}
        tabBarExtraContent={renderBtns()}>
        <CardOrTable<any>
          dataSource={current.items}
          rowKey={'id'}
          params={tkey}
          operation={renderOperate}
          columns={DictItemColumns}
          showChangeBtn={false}
        />
      </PageCard>
      <DictItemModal
        open={['新增', '编辑'].includes(activeModel)}
        data={dictItem}
        current={current}
        handleCancel={() => {
          setActiveModel('');
          setDictItem(undefined);
        }}
        handleOk={(success: boolean | undefined) => {
          if (success) {
            message.success('操作成功');
            setDictItem(undefined);
            setActiveModel('');
            tforceUpdate();
          }
        }}
      />
    </Card>
  );
};
export default DictInfo;
