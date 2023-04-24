import React, { useEffect, useState } from 'react';
import { ISpace, emitter } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import { XProperty } from '@/ts/base/schema';
import { PropertyColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import PropertyModal from './modal';
import { Space, message } from 'antd';
/**
 * @description: 分类特性标准
 * @return {*}
 */
const Property: React.FC<any> = ({ current }: { current: ISpace }) => {
  const [modalType, setModalType] = useState('');
  const [tkey, tforceUpdate] = useObjectUpdate(emitter);
  const [editData, setEditData] = useState<XProperty>();
  // 操作内容渲染函数
  const renderOperate = (item: XProperty) => {
    return [
      {
        key: '修改属性',
        label: '编辑属性',
        onClick: () => {
          setEditData(item);
          setModalType('修改属性');
        },
      },
      {
        key: '删除属性',
        label: '删除属性',
        onClick: async () => {
          await current.property.deleteProperty(item.id);
          tforceUpdate();
        },
      },
    ];
  };

  useEffect(() => {
    tforceUpdate();
  }, []);

  return (
    <>
      <CardOrTable<XProperty>
        rowKey={'id'}
        params={tkey}
        request={async (page) => {
          return await current.property.loadPropertys(page);
        }}
        operation={renderOperate}
        columns={PropertyColumns}
        showChangeBtn={false}
        dataSource={[]}
      />
      {/** 新增/编辑特性模态框 */}
      <PropertyModal
        space={current}
        data={editData}
        open={modalType != ''}
        handleCancel={() => {
          setModalType('');
        }}
        handleOk={function (success: boolean): void {
          setModalType('');
          if (success) {
            message.success('操作成功');
            tforceUpdate();
          }
        }}
      />
    </>
  );
};
export default Property;
