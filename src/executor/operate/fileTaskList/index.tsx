import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import { TaskModel } from '@/ts/base/model';
import { IDirectory } from '@/ts/core';
import { List, Progress, Drawer, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

/** 文件上传列表 */
const FileTaskList = ({
  directory,
  finished,
}: {
  directory: IDirectory;
  finished: () => void;
}) => {
  const [taskList, setTaskList] = useState(directory.taskList);
  useEffect(() => {
    const id = directory.taskEmitter.subscribe(() => {
      setTaskList([...directory.taskList]);
    });
    return () => {
      directory.unsubscribe(id);
    };
  }, []);
  const getProcess = (f: number, s: number) => {
    s = s == 0 ? 1 : s;
    return parseInt(((f * 10000.0) / s).toFixed(0)) / 100;
  };
  const loadTasks = (tlst: TaskModel[]) => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={tlst}
        renderItem={(item) => {
          return (
            <List.Item
              style={{ cursor: 'pointer', padding: 6 }}
              actions={[
                <div key={item.name} style={{ width: 60 }}>
                  {getProcess(item.finished, item.size)}%
                </div>,
              ]}>
              <List.Item.Meta
                avatar={<TypeIcon iconType={'文件'} size={50} />}
                title={<strong>{item.name}</strong>}
                description={
                  <Progress
                    status={item.finished === -1 ? 'exception' : 'success'}
                    percent={getProcess(item.finished, item.size)}
                  />
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };
  return (
    <Drawer
      title="操作记录"
      open
      width={500}
      placement="right"
      destroyOnClose
      onClose={() => finished()}>
      <Tabs
        centered
        items={[
          {
            key: 'uploading',
            label: '上传中',
            children: loadTasks(
              taskList.filter((i) => i.finished >= 0 && i.finished < i.size),
            ),
          },
          {
            key: 'uploaded',
            label: '已完成',
            children: loadTasks(
              taskList.filter((i) => i.finished < 0 || i.finished >= i.size),
            ),
          },
        ]}
      />
    </Drawer>
  );
};
export default FileTaskList;
