import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { formatZhDate } from '@/utils/tools';
import { Button, Drawer, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  PauseCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Theme } from '@/config/theme';

interface IProps {
  current: ITransfer;
}

const Tasks: React.FC<IProps> = ({ current }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState(current.taskList);
  useEffect(() => {
    const id = current.command.subscribe((type, cmd) => {
      if (type == 'tasks') {
        switch (cmd) {
          case 'refresh':
            setTasks([...current.taskList]);
            break;
          case 'open':
            setOpen(true);
            break;
        }
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title="任务记录"
      placement="bottom"
      closable={true}>
      <Table<model.Task>
        dataSource={tasks.map((item) => item.metadata)}
        columns={[
          {
            title: '运行状态',
            dataIndex: 'status',
            render: (_, record) => {
              return <TaskStatus status={record.status} />;
            },
          },
          {
            title: '运行开始时间',
            dataIndex: 'startTime',
            render: (_, record) => {
              return <>{formatZhDate(record.startTime)}</>;
            },
          },
          {
            title: '运行结束时间',
            dataIndex: 'endTime',
            render: (_, record) => {
              return <>{record.endTime ? formatZhDate(record.endTime) : ''}</>;
            },
          },
          {
            title: '节点数',
            dataIndex: 'nodesLen',
            render: (_, record) => {
              return <>{record.nodes.length}</>;
            },
          },
          {
            title: '边数',
            dataIndex: 'edgeLen',
            render: (_, record) => {
              return <>{record.edges.length}</>;
            },
          },
          {
            title: '运行环境',
            dataIndex: 'env',
            render: (_, record) => {
              return <>{record.env?.name}</>;
            },
          },
          {
            title: '操作',
            dataIndex: 'operate',
            render: () => {
              return <Button onClick={() => {}}>查看</Button>;
            },
          },
        ]}
      />
    </Drawer>
  );
};

export const TaskStatus: React.FC<{ status: model.GStatus }> = ({ status }) => {
  switch (status) {
    case 'Editable':
      return <PauseCircleOutlined style={{ color: Theme.FocusColor, fontSize: 18 }} />;
    case 'Viewable':
      return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />;
    case 'Running':
      return <LoadingOutlined style={{ color: Theme.FocusColor, fontSize: 18 }} />;
    case 'Error':
      return <StopOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />;
  }
};

export default Tasks;
