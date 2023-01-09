import React, { useState } from 'react';
import { INullSpeciesItem, ISpeciesItem, ITarget } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import userCtrl from '@/ts/controller/setting';
import { XMethod } from '@/ts/base/schema';
import { PageRequest } from '@/ts/base/model';
import thingCtrl from '@/ts/controller/thing';
import { MethodColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import MethodModel from '../../../components/methodModal';

interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
  modalType: string;
  setModalType: (modalType: string) => void;
}

/**
 * @description: 分类--业务标准
 * @return {*}
 */
const Method = ({ current, target, modalType, setModalType }: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XMethod>();
  // 操作内容渲染函数
  const renderOperate = (item: XMethod) => {
    return [
      {
        key: '设计表单',
        label: '设计表单',
        onClick: async () => {
          await current?.deleteAttr(item.id);
          tforceUpdate();
        },
      },
      {
        key: '修改',
        label: '编辑',
        onClick: () => {
          setEditData(item);
          setModalType('修改业务');
        },
      },
      {
        key: '删除',
        label: '删除',
        onClick: async () => {
          await current?.deleteAttr(item.id);
          tforceUpdate();
        },
      },
    ];
  };

  const findSpecesName = (species: INullSpeciesItem, id: string) => {
    if (species) {
      if (species.id == id) {
        return species.name;
      }
      for (const item of species.children) {
        if (findSpecesName(item, id) != id) {
          return item.name;
        }
      }
    }
    return id;
  };

  const loadMethods = async (page: PageRequest) => {
    const res = await current!.loadMethods(userCtrl.space.id, page);
    if (res && res.result) {
      for (const item of res.result) {
        const team = userCtrl.findTeamInfoById(item.belongId);
        if (team) {
          item.belongId = team.name;
        }
        item.speciesId = findSpecesName(thingCtrl.teamSpecies, item.speciesId);
      }
    }
    return res;
  };
  return (
    <>
      <CardOrTable<XMethod>
        rowKey={'id'}
        params={tkey}
        request={async (page) => {
          return await loadMethods(page);
        }}
        operation={renderOperate}
        columns={MethodColumns}
        showChangeBtn={false}
        dataSource={[]}
      />
      {/** 新增/编辑业务标准模态框 */}
      <MethodModel
        data={editData}
        title={modalType}
        open={modalType.includes('业务标准')}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={function (success: boolean): void {
          setModalType('');
          if (success) {
            tforceUpdate();
          }
        }}
        target={target}
        current={current}
      />
    </>
  );
};
export default Method;
