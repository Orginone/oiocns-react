import React, { useState, useRef } from 'react';
import { Modal, Row, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cls from './index.module.less';
import { initDatatype } from '@/ts/core/setting/isetting';
import AddNewPosition from './AddNewPosition';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import { IAuthority } from '@/ts/core/target/authority/iauthority';

interface Iprops {
  title: string;
  open: boolean;
  onOk: (checkJob: initDatatype, checkUser: initDatatype[]) => void;
  handleOk: () => void;
  datasource: IAuthority;
}
interface DataType {
  key: React.ReactNode;
  id: string;
  name: number;
  code: string;
  remark: string;
  public: boolean;
  parentId?: string;
  status?: string;
  children?: DataType[];
}

const AddPostModal = (props: Iprops) => {
  const { title, open, handleOk, datasource } = props;
  const parentRef = useRef<any>(null);
  const [operateOpen, setOperateOpen] = useState<boolean>(false);
  const [item, setItem] = useState<IAuthority>();

  const onHandleOk = () => {
    console.log('onHandleOk');
    setOperateOpen(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: '18%',
    },
    {
      title: '是否公开',
      dataIndex: 'public',
      key: 'public',
      width: '10%',
      render: (_, record) =>
        record.public === false ? <Tag color="red">否</Tag> : <Tag color="green">是</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: '20%',
    },
  ];

  const renderOperation = (item: IAuthority): common.OperationType[] => {
    return [
      {
        key: 'addNew',
        label: '新增',
        onClick: () => {
          setOperateOpen(true);
          setItem(item);
        },
      },
    ];
  };

  const addmodal = (
    <Modal
      title={title}
      open={open}
      onCancel={() => handleOk()}
      getContainer={false}
      width={1020}
      footer={null}>
      <div className="site-card-wrapper">
        <Row gutter={24}>
          <CardOrTable
            dataSource={[datasource]}
            rowKey={'id'}
            total={1}
            operation={renderOperation}
            columns={columns as any}
            parentRef={parentRef}
            showChangeBtn={false}
            pagination={false}
            defaultExpandAllRows={true}
            childrenColumnName={'children'}
          />
        </Row>
      </div>
    </Modal>
  );
  return (
    <div className={cls[`add-person-modal`]}>
      {addmodal}
      <AddNewPosition
        title={'新增身份'}
        open={operateOpen}
        handleOk={onHandleOk}
        authData={item!}
      />
    </div>
  );
};

export default AddPostModal;
