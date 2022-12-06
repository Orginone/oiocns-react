import React, { useEffect, useState } from 'react';
import { Drawer, Progress } from 'antd';
import cls from './index.module.less';
import docsCtrl, { TaskModel } from '@/ts/controller/store/docsCtrl';

type GroupTaskModel = {
  group: string;
  count: number;
  done: number;
  size: number;
  finished: number;
  tasks: TaskModel[];
};

type PlanType = {
  isOpen: boolean;
  onClose: () => void;
};

const TaskListComp: React.FC<PlanType> = (props: PlanType) => {
  const [taskList, setTaskList] = useState(docsCtrl.taskList);
  useEffect(() => {
    const id = docsCtrl.subscribe(() => {
      setTaskList([...docsCtrl.taskList]);
    });
    return () => {
      docsCtrl.unsubscribe(id);
    };
  }, []);
  const taskGroup = () => {
    let group: GroupTaskModel[] = [];
    taskList
      .sort((a, b) => {
        return a.createTime < b.createTime ? 1 : 0;
      })
      .forEach((item) => {
        const index = group.findIndex((i) => {
          return i.group == item.group;
        });
        if (index > -1) {
          group[index].tasks.unshift(item);
          group[index].count += 1;
          group[index].size += item.size;
          group[index].finished += item.finished;
          group[index].done += item.finished == item.size ? 1 : 0;
        } else {
          group.unshift({
            count: 1,
            size: item.size,
            finished: item.finished,
            group: item.group,
            tasks: [item],
            done: item.finished == item.size ? 1 : 0,
          });
        }
      });
    return group;
  };
  const getProcess = (f: number, s: number) => {
    return parseInt(((f * 10000.0) / s).toFixed(0)) / 100;
  };
  return (
    <>
      <Drawer
        title="操作记录"
        placement="right"
        onClose={props.onClose}
        open={props.isOpen}>
        {taskGroup().map((g) => {
          return (
            <div key={g.group} className={cls['box']}>
              <div className={cls['top_box']}>
                <div>
                  {g.count}项被上传到[{g.group}]目录下
                </div>
                <div className={cls['mod']}>
                  <Progress percent={getProcess(g.finished, g.size)} width={90} />
                </div>
              </div>
              {g.tasks.map((t) => {
                return (
                  <div key={t.name} className={cls['mod_children']}>
                    <img
                      src="/icons/default_file.svg"
                      alt=""
                      className={cls['mod_children_img']}
                    />
                    <div className={cls['mod_children_content']}>
                      <div className={cls.name}>{t.name}</div>
                      <Progress percent={getProcess(t.finished, t.size)} width={70} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Drawer>
    </>
  );
};
export default TaskListComp;
