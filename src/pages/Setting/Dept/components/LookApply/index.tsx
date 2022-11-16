import React from 'react';
import { Modal, Table, Tag, Dropdown, Menu } from 'antd';
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

const items = [
  //操作行
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        通过
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
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
    render: (_text, record) => (
      <Dropdown className={cls['operation-btn']} menu={{ items }} key="key">
        <EllipsisOutlined />
      </Dropdown>
    ),
  },
];

const LookApply = (props: Iprops) => {
  const { title, open, onOk, handleOk } = props;
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
