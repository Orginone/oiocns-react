import CardOrTable from '@/components/CardOrTableComp';
import { FormColumns } from '@/pages/Setting/config/columns';
import { XForm } from '@/ts/base/schema';
import { message, Popconfirm } from 'antd';
import React, { useState } from 'react';
import OperationModel from './modal';
import ViewFormModal from './Design/viewFormModal';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';
import useObjectUpdate from '@/hooks/useObjectUpdate';

interface IProps {
  current: IWorkForm;
  recursionOrg: boolean;
  recursionSpecies: boolean;
  setSelectedOperation: (operation: XForm) => void;
}

/**
 * @description: 分类--表单列表
 * @return {*}
 */
const FormList = (props: IProps) => {
  const [modalType, setModalType] = useState('');
  const [key, forceUpdate] = useObjectUpdate('');
  const [editData, setEditData] = useState<XForm>();

  let data = props.current.forms;
  if (!props.recursionOrg) {
    data = data.filter((a) => a.belongId == props.current.current.metadata.id);
  }
  if (!props.recursionSpecies) {
    data = data.filter((a) => a.speciesId == props.current.metadata.id);
  }

  // 操作内容渲染函数
  const renderOperate = (item: XForm) => {
    return [
      {
        key: '修改',
        label: '编辑表单',
        onClick: () => {
          setEditData(item);
          setModalType('编辑表单');
        },
      },
      {
        key: '设计表单',
        label: '设计表单',
        onClick: () => {
          setEditData(item);
          props.setSelectedOperation(item);
        },
      },
      {
        key: '预览表单',
        label: '预览表单',
        onClick: () => {
          setEditData(item);
          setModalType('预览表单');
        },
      },
      {
        key: '删除表单',
        label: (
          <Popconfirm
            placement="left"
            trigger={'click'}
            title={'确定删除吗？'}
            onConfirm={async () => {
             if (await props.current.deleteForm(item)) {
               forceUpdate();
             }
            }}
            okText="确定"
            cancelText="取消">
            <div>删除表单</div>
          </Popconfirm>
        ),
      },
    ];
  };

  return (
    <>
      <CardOrTable<XForm>
        key={key}
        rowKey={'id'}
        dataSource={data}
        showChangeBtn={false}
        operation={renderOperate}
        columns={FormColumns(props.current)}
      />
      {/** 表单模态框 */}
      <OperationModel
        data={editData}
        title={modalType}
        current={props.current}
        open={modalType == '编辑表单'}
        handleCancel={() => setModalType('')}
        handleOk={async () => {
          setModalType('');
          setEditData(undefined);
          forceUpdate();
          message.success('保存成功');
        }}
      />
      ;{/** 预览表单 */}
      <ViewFormModal
        belong={props.current.current.space}
        data={editData}
        open={modalType == '预览表单'}
        handleCancel={() => {
          setModalType('');
        }}
        handleOk={() => {
          setModalType('');
        }}
      />
    </>
  );
};
export default FormList;
