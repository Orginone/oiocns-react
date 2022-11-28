/**
 * 对象设置弹窗
 * */
import React, { useState, useRef } from 'react';
import { Modal, Row, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import SearchInput from '@/components/SearchInput';
import cls from './index.module.less';
// import { DownOutlined, UpOutlined } from '@ant-design/icons';
// import { deepClone } from '@/ts/base/common';
import { initDatatype } from '@/ts/core/setting/isetting';
import { ObjectManagerList } from './mock';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';

interface Iprops {
  title: string;
  open: boolean;
  onOk: (checkJob: initDatatype, checkUser: initDatatype[]) => void;
  handleOk: () => void;
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
  const { title, open, onOk, handleOk } = props;
  const parentRef = useRef<any>(null); //父级容器Dom
  const [operateOpen, setOperateOpen] = useState<boolean>(false); //切换设置

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  };

  const getCheckboxProps = (record: any) => {
    // console.log(record);
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
    },
    {
      title: '是否公开',
      dataIndex: 'public',
      key: 'public',
      width: '10%',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: '25%',
    },
  ];

  /**渲染操作 */
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'addNew',
        label: '新增',
        onClick: () => {
          console.log('新增按钮事件', 'addNew', item);
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
      width={1100}
      footer={null}>
      <div className="site-card-wrapper">
        <Row gutter={24}>
          {/* <Table
            columns={columns}
            defaultExpandAllRows={true}
            pagination={false}
            dataSource={ObjectManagerList}
          /> */}

          <CardOrTable
            dataSource={ObjectManagerList as any}
            rowKey={'key'}
            operation={renderOperation}
            columns={columns as any}
            parentRef={parentRef}
            showChangeBtn={false}
            pagination={false}
            defaultExpandAllRows={true}
            rowSelection={{
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps,
            }}
          />
        </Row>
      </div>
      <Row justify="end">
        <Button
          type="primary"
          onClick={() => {
            onOk();
          }}>
          完成
        </Button>
      </Row>
    </Modal>
  );
  return <div className={cls[`add-person-modal`]}>{addmodal}</div>;
};

export default AddPostModal;
