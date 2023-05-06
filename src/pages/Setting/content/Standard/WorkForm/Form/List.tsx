import CardOrTable from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { FormColumns } from '@/pages/Setting/config/columns';
import { XForm } from '@/ts/base/schema';
import { message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import OperationModel from './modal';
import ViewFormModal from './Design/viewFormModal';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';

interface IProps {
  current: IWorkForm;
  recursionOrg: boolean;
  recursionSpecies: boolean;
  setSelectedOperation: (operation: XForm) => void;
  setTabKey: (tabKey: number) => void;
}

/**
 * @description: 分类--表单列表
 * @return {*}
 */
const List = ({
  current,
  recursionOrg,
  recursionSpecies,
  setSelectedOperation,
  setTabKey,
}: IProps) => {
  const [modalType, setModalType] = useState('');
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editData, setEditData] = useState<XForm>();
  const [viewFormOpen, setViewFormOpen] = useState(false);
  const [dataSource, setDataSource] = useState<XForm[]>([]);

  useEffect(() => {
    setTimeout(async () => {
      let data = await current.loadForms();
      if (!recursionOrg) {
        data = data.filter((a) => a.belongId == current.current.metadata.id);
      }
      if (!recursionSpecies) {
        data = data.filter((a) => a.speciesId == current.metadata.id);
      }
      setDataSource(data);
    }, 100);
    tforceUpdate();
  }, [recursionSpecies, recursionOrg]);

  // 操作内容渲染函数
  const renderOperate = (item: XForm) => {
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
      // {
      //   key: '预览卡片',
      //   label: '预览卡片',
      //   onClick: () => {
      //     setEditData(item);
      //     setViewCardOpen(true);
      //   },
      // },
      {
        key: '删除',
        label: (
          <Popconfirm
            placement="left"
            trigger={'click'}
            title={'确定删除吗？'}
            onConfirm={async () => {
              await current.deleteForm(item);
              tforceUpdate();
            }}
            okText="确定"
            cancelText="取消">
            <div>删除</div>
          </Popconfirm>
        ),
      },
    ];
  };

  return (
    <>
      <CardOrTable<XForm>
        key={tkey}
        rowKey={'id'}
        params={tkey}
        dataSource={dataSource}
        showChangeBtn={false}
        operation={renderOperate}
        columns={FormColumns([current])}
      />
      {/** 表单模态框 */}
      <OperationModel
        data={editData}
        title={modalType}
        current={current}
        open={modalType.includes('表单')}
        handleCancel={() => setModalType('')}
        handleOk={async (res: any) => {
          setModalType('');
          if (res) {
            message.success('保存成功');
            setEditData(undefined);
            tforceUpdate();
          }
        }}
      />
      {/** 预览表单 */}
      <ViewFormModal
        species={current}
        data={editData}
        open={viewFormOpen}
        handleCancel={() => {
          setViewFormOpen(false);
        }}
        handleOk={() => {
          setViewFormOpen(false);
        }}
      />
      {/** 预览卡片 */}
      {/* <ViewCardModal
        data={editData}
        open={viewCardOpen}
        handleCancel={() => {
          setViewCardOpen(false);
        }}
        handleOk={() => {
          setViewCardOpen(false);
        }}
      /> */}
    </>
  );
};
export default List;
