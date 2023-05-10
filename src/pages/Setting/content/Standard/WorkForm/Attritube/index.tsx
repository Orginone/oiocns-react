import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute } from '@/ts/base/schema';
import { AttributeColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import AttributeModal from './modal';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';

interface IProps {
  current: IWorkForm;
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
  modalType,
  recursionOrg,
  recursionSpecies,
  setModalType,
}: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XAttribute>();
  const [dataSource, setDataSource] = useState<XAttribute[]>([]);
  // 操作内容渲染函数
  const renderOperate = (item: XAttribute) => {
    if (
      item.speciesId === current.metadata.id &&
      (item.belongId === current.current.metadata.id ||
        item.belongId === current.current.space.metadata.id)
    ) {
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
            if (await current.deleteAttribute(item)) {
              tforceUpdate();
            }
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
        // {
        //   key: '复制属性',
        //   label: '复制属性',
        //   onClick: async () => {
        //     if (item.property) {
        //       const property = await current.team.space.property?.createProperty({
        //         ...item.property,
        //         belongId: current.team.target.belongId,
        //         sourceId: item.property.belongId,
        //       });
        //       if (property) {
        //         await current.updateAttribute({
        //           ...item,
        //           propId: property.id,
        //         });
        //       }
        //     }
        //   },
        // },
      ];
    }
    return [];
  };

  useEffect(() => {
    let temp = current.attributes;
    if (!recursionOrg) {
      temp = temp.filter((i) => i.shareId === current.current.metadata.id);
    }
    if (!recursionSpecies) {
      temp = temp.filter((i) => i.speciesId === current.metadata.id);
    }
    setDataSource(temp);
  }, [current, recursionOrg, recursionSpecies]);

  return (
    <>
      <CardOrTable<XAttribute>
        key={tkey}
        rowKey={'id'}
        params={tkey}
        operation={renderOperate}
        columns={AttributeColumns(current)}
        showChangeBtn={false}
        dataSource={dataSource}
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
        current={current}
      />
      {/** 关联属性模态框 */}
      <div></div>
    </>
  );
};
export default Attritube;
