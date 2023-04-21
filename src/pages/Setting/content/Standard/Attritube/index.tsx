import React, { useEffect, useState } from 'react';
import { ISpace, ISpeciesItem, ITarget } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import orgCtrl from '@/ts/controller';
import { XAttribute } from '@/ts/base/schema';
import { PageRequest } from '@/ts/base/model';
import { AttributeColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import AttributeModal from './attributeModal';

interface IProps {
  target: ITarget;
  current: ISpeciesItem;
  modalType: string;
  recursionOrg: boolean;
  recursionSpecies: boolean;
  setModalType: (modalType: string) => void;
}

/**
 * @description: 分类特性标准
 * @return {*}
 */
const Attritube = ({
  current,
  target,
  modalType,
  recursionOrg,
  recursionSpecies,
  setModalType,
}: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XAttribute>();
  // 操作内容渲染函数
  const renderOperate = (item: XAttribute) => {
    if (item.belongId === orgCtrl.user.id) {
      return [
        {
          key: '修改特性',
          label: '编辑特性',
          onClick: () => {
            setEditData(item);
            setModalType('修改特性');
          },
        },
        {
          key: '删除特性',
          label: '删除特性',
          onClick: async () => {
            await current?.deleteAttr(item.id);
            tforceUpdate();
          },
        },
      ];
    }
    if (item.belongId) {
      return [
        {
          key: '关联属性',
          label: '关联属性',
          onClick: () => {
            setEditData(item);
            setModalType('关联属性');
          },
        },
        {
          key: '复制属性',
          label: '复制属性',
          onClick: async () => {
            if (item.property) {
              const property = await target.space.property?.createProperty({
                ...item.property,
                belongId: orgCtrl.user.id,
                sourceId: item.property.belongId,
              });
              if (property) {
                await current.updateAttr({
                  ...item,
                  propId: property.id,
                });
              }
            }
          },
        },
      ];
    }
    return [];
  };

  useEffect(() => {
    tforceUpdate();
  }, [recursionOrg]);

  useEffect(() => {
    tforceUpdate();
  }, [recursionSpecies]);

  const loadAttrs = async (page: PageRequest) => {
    return await current!.loadAttrsByPage(
      target.id,
      recursionOrg,
      recursionSpecies,
      page,
    );
  };
  return (
    <>
      <CardOrTable<XAttribute>
        rowKey={'id'}
        params={tkey}
        request={async (page) => {
          return await loadAttrs(page);
        }}
        operation={renderOperate}
        columns={AttributeColumns(target?.species || [])}
        showChangeBtn={false}
        dataSource={[]}
      />
      {/** 新增/编辑特性模态框 */}
      <AttributeModal
        data={editData}
        title={modalType}
        open={modalType.includes('特性')}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={function (success: boolean): void {
          setModalType('');
          if (success) {
            tforceUpdate();
          }
        }}
        target={target as ISpace}
        current={current}
      />
      {/** 关联属性模态框 */}
      <div></div>
    </>
  );
};
export default Attritube;
