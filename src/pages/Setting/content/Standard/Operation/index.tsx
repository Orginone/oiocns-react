import React, { useState } from 'react';
import { ISpeciesItem, ITarget } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import userCtrl from '@/ts/controller/setting';
import { XOperation } from '@/ts/base/schema';
import { PageRequest } from '@/ts/base/model';
import { OperationColumns, OperationItemColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import OperationModel from '../../../components/operationModal';
import FormDesignModal from '../../../components/formDesignModal';
import ViewFormModal from '../../../components/viewFormModal';
import { ProTable } from '@ant-design/pro-components';
import { kernel } from '@/ts/base';

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
const Operation = ({ current, target, modalType, setModalType }: IProps) => {
  let selectRow: XOperation;
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XOperation>();
  const [open, setOpen] = useState<boolean>(false);
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);

  // 操作内容渲染函数
  const renderOperate = (item: XOperation) => {
    return [
      {
        key: '修改',
        label: '编辑',
        onClick: () => {
          setEditData(item);
          setModalType('修改业务标准');
        },
      },
      {
        key: '删除',
        label: '删除',
        onClick: async () => {
          await current?.deleteOperation(item.id);
          tforceUpdate();
        },
      },
      {
        key: '设计表单',
        label: '设计表单',
        onClick: () => {
          setEditData(item);
          setOpen(true);
        },
      },
      {
        key: '预览表单',
        label: '预览表单',
        onClick: () => {
          setEditData(item);
          setViewFormOpen(true);
        },
      },
    ];
  };

  const loadOperations = async (page: PageRequest) => {
    return await current!.loadOperations(userCtrl.space.id, page);
  };

  const onRow = (record: any) => {
    selectRow = record;
  };

  const expandedRowRender = (record: XOperation) => {
    return (
      <ProTable
        columns={OperationItemColumns}
        headerTitle={false}
        search={false}
        options={false}
        pagination={false}
        request={async () => {
          const res = await kernel.queryOperationItems({
            id: record.id || selectRow?.id,
            spaceId: userCtrl.space.id,
            page: { offset: 0, limit: 100000, filter: '' },
          });
          return { total: res.data.total, data: res.data.result, success: true };
        }}
      />
    );
  };

  return (
    <>
      <CardOrTable<XOperation>
        rowKey={'id'}
        params={tkey}
        request={async (page) => {
          return await loadOperations(page);
        }}
        operation={renderOperate}
        columns={OperationColumns}
        showChangeBtn={false}
        dataSource={[]}
        expandable={{ expandedRowRender }}
        onRow={onRow}
      />
      {/** 新增/编辑业务标准模态框 */}
      <OperationModel
        data={editData as XOperation}
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
      <FormDesignModal
        data={editData as XOperation}
        title={modalType}
        open={open}
        handleCancel={function (): void {
          setOpen(false);
        }}
        handleOk={function (success: boolean): void {
          setOpen(false);
          if (success) {
            tforceUpdate();
          }
        }}
        target={target}
        current={current}
      />
      <ViewFormModal
        data={editData}
        open={viewFormOpen}
        handleCancel={() => {
          setViewFormOpen(false);
        }}
        handleOk={() => {
          setViewFormOpen(false);
        }}
      />
    </>
  );
};
export default Operation;
