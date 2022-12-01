import React from 'react';
import { Drawer, Progress } from 'antd';
import cls from './index.module.less';

export type TaskModel = {
  group: string;
  name: string;
  size: number;
  process: number;
  createTime: Date;
};

type GroupTaskModel = {
  group: string;
  count: number;
  done: number;
  process: number;
  tasks: TaskModel[];
};

type PlanType = {
  isOpen: boolean;
  taskList: TaskModel[];
  onClose: () => void;
};

const TaskListComp: React.FC<PlanType> = (props: PlanType) => {
  const taskGroup = () => {
    let group: GroupTaskModel[] = [];
    props.taskList
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
          group[index].process += item.process;
          group[index].done += item.process == 1 ? 1 : 0;
        } else {
          group.unshift({
            count: 1,
            process: item.process,
            group: item.group,
            tasks: [item],
            done: item.process == 1 ? 1 : 0,
          });
        }
      });
    return group.map((g) => {
      g.process = g.process / g.tasks.length;
      return g;
    });
  };
  const getProcess = (p: number) => {
    return parseInt((p * 10000).toFixed(0)) / 100;
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
                  <Progress percent={getProcess(g.process)} width={90} />
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
                      <Progress percent={getProcess(t.process)} width={70} />
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
