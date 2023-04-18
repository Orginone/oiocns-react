import React, { useEffect, useState } from 'react';
import { emitter } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import { XProperty } from '@/ts/base/schema';
import { PropertyColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import PropertyModal from './modal';
import thing from '@/ts/controller/thing';

/**
 * @description: 分类特性标准
 * @return {*}
 */
const Property = () => {
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
          await thing.property?.deleteProperty(item.id);
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
          return await thing.property?.loadPropertys(page);
        }}
        operation={renderOperate}
        columns={PropertyColumns}
        showChangeBtn={false}
        dataSource={[]}
      />
      {/** 新增/编辑特性模态框 */}
      <PropertyModal
        data={editData}
        open={modalType != ''}
        handleCancel={() => {
          setModalType('');
        }}
        handleOk={function (success: boolean): void {
          setModalType('');
          if (success) {
            tforceUpdate();
          }
        }}
      />
    </>
  );
};
export default Property;
