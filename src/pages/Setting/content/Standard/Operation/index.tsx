import React, { useState } from 'react';
import { ISpeciesItem, ITarget } from '@/ts/core';
import CardOrTable from '@/components/CardOrTableComp';
import userCtrl from '@/ts/controller/setting';
import { XOperation } from '@/ts/base/schema';
import { PageRequest } from '@/ts/base/model';
import { OperationColumns } from '@/pages/Setting/config/columns';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import OperationModel, { transformItemModel } from '../../../components/operationModal';
import FormDesignModal from '../../../components/formDesignModal';
import OperationItemTable from '../../../components/operationItemTable';
import ViewFormModal from '../../../components/viewFormModal';
import ViewCardModal from '../../../components/viewCardModal';
import { message, Popconfirm } from 'antd';
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

  const [designOpen, setDesignOpen] = useState<boolean>(false);
  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [viewCardOpen, setViewCardOpen] = useState<boolean>(false);
  // 添加表单项
  const appendItems = async (operation: XOperation) => {
    const res = await current.loadAttrs(userCtrl.space.id, {
      offset: 0,
      limit: 100000,
      filter: '',
    });
    let attrs = (res.result || []).filter((attr) => attr.belongId === userCtrl.space.id);
    if (attrs.length > 0) {
      const existItemsRes = await kernel.queryOperationItems({
        id: operation.id,
        spaceId: userCtrl.space.id,
        page: { offset: 0, limit: 100000, filter: '' },
      });
      const existCodes = (existItemsRes.data?.result || []).map((i) => i.code);
      attrs = attrs.filter((attr) => !existCodes.includes(attr.id));
      const items = transformItemModel(attrs, operation);
      if (items.length > 0) {
        let result = false;
        for (const item of items) {
          const res = await kernel.createOperationItem(item);
          result = res.success;
        }
        if (result) {
          message.success('向表单补充字段成功！');
          tforceUpdate();
        } else {
          message.error('向表单补充字段失败！');
        }
      } else {
        message.warning('当前表单已包括所有有权限的特性！');
      }
    } else {
      message.warning('当前表单已包括所有有权限的特性！');
    }
  };

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
        label: (
          <Popconfirm
            placement="left"
            trigger={'click'}
            title={'确定删除吗？'}
            onConfirm={async () => {
              await current?.deleteOperation(item.id);
              tforceUpdate();
            }}
            okText="确定"
            cancelText="取消">
            <div>删除</div>
          </Popconfirm>
        ),
      },
      {
        key: '设计表单',
        label: '设计表单',
        onClick: () => {
          setEditData(item);
          setDesignOpen(true);
        },
      },
      {
        key: '补充字段',
        label: '补充字段',
        onClick: () => {
          appendItems(item);
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
      {
        key: '预览卡片',
        label: '预览卡片',
        onClick: () => {
          setEditData(item);
          setViewCardOpen(true);
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
      <OperationItemTable operationId={record.id || selectRow?.id} current={current} />
    );
  };

  return (
    <>
      <CardOrTable<XOperation>
        key={tkey}
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
        handleOk={async (res: any) => {
          setModalType('');
          if (res.success) {
            message.success('保存成功');
            tforceUpdate();
            if (modalType.includes('新增')) {
              await kernel.createFlowRelation({
                defineId: '413412066620215296',
                operationId: res.data.id,
              });
            }
          }
        }}
        target={target}
        current={current}
      />
      <FormDesignModal
        data={editData as XOperation}
        title={modalType}
        open={designOpen}
        handleCancel={function (): void {
          setDesignOpen(false);
          setEditData(undefined);
        }}
        handleOk={function (success: boolean): void {
          setDesignOpen(false);
          setEditData(undefined);
          message.success('保存成功');
          tforceUpdate();
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
      <ViewCardModal
        data={editData}
        open={viewCardOpen}
        handleCancel={() => {
          setViewCardOpen(false);
        }}
        handleOk={() => {
          setViewCardOpen(false);
        }}
      />
    </>
  );
};
export default Operation;
