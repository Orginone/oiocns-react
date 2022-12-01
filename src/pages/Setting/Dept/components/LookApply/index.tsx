import React from 'react';
import { Modal, Table, Tag, Dropdown, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EllipsisOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { data } from './moke';
interface Iprops {
  title: string;
  open: boolean;
  onOk: () => void;
  handleOk: () => void;
}

const LookApply = (props: Iprops) => {
  const { title, open, onOk, handleOk } = props;

  const items = [
    //操作行
    {
      key: '1',
      label: (
        <a
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '是否确认通过该申请',
              onOk: () => {
                message.success('申请已通过');
                onOk();
              },
            });
          }}>
          通过
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '是否确认拒绝该申请',
              onOk: () => {
                message.success('申请已被拒绝');
                onOk();
              },
            });
          }}>
          拒绝
        </a>
      ),
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'key',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'address',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (state) => (
        <div>
          {state === '已拒绝' ? (
            <Tag color="red" icon={<span className={cls['mos1']}></span>}>
              {state}
            </Tag>
          ) : state === '已加入' ? (
            <Tag color="green" icon={<span className={cls['mos2']}></span>}>
              {state}
            </Tag>
          ) : state === '待审核' ? (
            <Tag color="blue" icon={<span className={cls['mos3']}></span>}>
              {state}
            </Tag>
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: () => {
        return (
          <Dropdown className={cls['operation-btn']} menu={{ items }} key="key">
            <EllipsisOutlined />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={handleOk}>
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        scroll={{ x: 300, y: '200px' }}
        pagination={false}
      />
    </Modal>
  );
};
export default LookApply;
