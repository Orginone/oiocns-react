import CardOrTable from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { OperationColumns } from '@/pages/Setting/config/columns';
import { PageRequest } from '@/ts/base/model';
import { XOperation } from '@/ts/base/schema';
import orgCtrl from '@/ts/controller';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import OperationModel from './operationModal';
import ViewCardModal from '../../../components/viewCardModal';
import ViewFormModal from '../../../components/viewFormModal';

interface IProps {
  target?: ITarget;
  current: ISpeciesItem;
  modalType: string;
  recursionOrg: boolean;
  recursionSpecies: boolean;
  setModalType: (modalType: string) => void;
  setSelectedOperation: (operation: XOperation) => void;
  setTabKey: (tabKey: number) => void;
}

/**
 * @description: 分类--表单列表
 * @return {*}
 */
const Operation = ({
  current,
  target,
  modalType,
  recursionOrg,
  recursionSpecies,
  setModalType,
  setSelectedOperation,
  setTabKey,
}: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XOperation>();

  const [viewFormOpen, setViewFormOpen] = useState<boolean>(false);
  const [viewCardOpen, setViewCardOpen] = useState<boolean>(false);

  useEffect(() => {
    tforceUpdate();
  }, [recursionOrg]);

  useEffect(() => {
    tforceUpdate();
  }, [recursionSpecies]);

  useEffect(() => {
    tforceUpdate();
  }, []);

  // 操作内容渲染函数
  const renderOperate = (item: XOperation) => {
    return [
      {
        key: '修改',
        label: '编辑',
        onClick: () => {
          setEditData(item);
          setModalType('修改表单');
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
          setSelectedOperation(item);
          setTabKey(1);
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
  // 加载业务表单列表
  const loadOperations = async (page: PageRequest) => {
    if (orgCtrl.user.id && page) {
      return await current!.loadOperations(
        orgCtrl.user.id,
        false,
        recursionOrg,
        recursionSpecies,
        page,
      );
    }
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
        columns={OperationColumns(target?.species || [])}
        showChangeBtn={false}
        dataSource={[]}
      />
      {/** 新增/编辑表单模态框 */}
      <OperationModel
        data={editData as XOperation}
        title={modalType}
        open={modalType.includes('表单')}
        handleCancel={function (): void {
          setModalType('');
        }}
        handleOk={async (res: any) => {
          setModalType('');
          if (res) {
            message.success('保存成功');
            setEditData(undefined);
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
