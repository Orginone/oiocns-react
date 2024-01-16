import { Tabs, Spin, Empty } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import { IWork, IWorkTask, TaskTypeName } from '@/ts/core';
import { model, schema } from '@/ts/base';
import ListTable from './listTable';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { getNodeByNodeId } from '@/utils/tools';
import FullScreenModal from '@/components/Common/fullScreen';
import TaskStart from '@/executor/tools/task/start';
import orgCtrl from '@/ts/controller';
import Content from '@/executor/tools/task';

interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
  data?: model.InstanceDataModel;
  activeKey?: string;
  tabTableData?: any;
}

/** 多tab表格 */
const MultitabTable: React.FC<IProps> = ({
  current,
  data,
  finished,
  activeKey = '1',
  // tabTableData,
}) => {
  const [editCurrent, setEditCurrent] = useState(current);
  const editForm = () => {
    console.log('editCurrent', editCurrent);
    setTodoModel(!todoModel);
  };
  const deleteForm = () => {
    console.log('editCurrent', editCurrent);
  };
  let tabData = [
    {
      label: '草稿箱',
      key: '1',
      tableHeader: [],
      tableData: [],
      buttonList: {
        visible: true,
        items: [
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '新增',
              icon: 'add',
              onClick: () => {
                setTodoModel(!todoModel);
              },
            },
            visible: true,
          },
          {
            name: 'add',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '编辑',
              onClick: () => {
                editForm();
              },
            },
            visible: true,
          },
          {
            name: 'delete',
            location: 'after',
            widget: 'dxButton',
            options: {
              text: '删除',
              onClick: () => {
                deleteForm();
              },
            },
            visible: true,
          },
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
    },
    {
      label: '已发起',
      key: '2',
      tableHeader: [],
      tableData: [],
      buttonList: {
        visible: true,
        items: [
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
    },
    {
      label: '已办结',
      key: '3',
      tableHeader: [],
      tableData: [],
      buttonList: {
        visible: true,
        items: [
          {
            name: 'columnChooserButton',
            location: 'after',
          },
          {
            name: 'searchPanel',
            location: 'after',
          },
        ],
      },
    },
  ];
  const [tabTableData, setTabTableData] = useState(tabData);
  const [activeTabKey, setActiveTabKey] = useState(activeKey);
  const [loaded, apply] = useAsyncLoad(() => current.createApply(undefined, data));
  const [todoModel, setTodoModel] = useState(false);
  if (!loaded) {
    return (
      <Spin tip={'配置信息加载中...'}>
        <div style={{ width: '100%', height: '100%' }}></div>
      </Spin>
    );
  }
  if (apply) {
    const node = getNodeByNodeId(apply.instanceData.node.id, apply.instanceData.node);
    const tags = ['草稿', '已办', '发起的'];
    let index = Number(activeTabKey) - 1;
    if (node) {
      if (tags[index] === '草稿') {
        orgCtrl.user.draftsColl.all().then((res) => {
          tabTableData[index].tableData = res;
        });
      } else {
        orgCtrl.work.loadContent(tags[index] as TaskTypeName).then((tasks) => {
          const newTasks = tasks
            .sort((a, b) => {
              return (
                new Date(b.taskdata.updateTime).getTime() -
                new Date(a.taskdata.updateTime).getTime()
              );
            })
            .filter((task) => {
              return task.metadata.defineId == current.metadata.id;
            });
          const promiseAll = newTasks.map((item) => {
            return item.loadInstance();
          });
          Promise.all(promiseAll).then((results) => {
            tabTableData[index].tableData = newTasks;
            setTabTableData(tabTableData);
          });
        });
      }
    }
    const handleValueChange = (val: any) => {
      if (val.selectedRowsData.length) {
        const curr = tabTableData[index].tableData.filter((task) => {
          return (
            task?.metadata?.defineId == val.selectedRowsData[0].id ||
            task?.id == val.selectedRowsData[0].id
          );
        });
        setEditCurrent(curr[0]);
      } else {
        setEditCurrent(current);
      }
    };
    const loadItems = () => {
      const items = [];
      for (let i = 0; i < tabTableData.length; i++) {
        if (node) {
          const form = node.primaryForms[0];
          tabTableData[i].tableHeader = apply.instanceData.fields[form.id];
        }
        items.push({
          key: tabTableData[i].key,
          forceRender: true,
          label: tabTableData[i].label,
          children: (
            <ListTable
              {...current}
              node={node}
              setEditCurrent={setEditCurrent}
              tableConfig={tabTableData[i]}
              handleValueChange={handleValueChange}
            />
          ),
        });
      }
      return items;
    };
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Tabs
          items={loadItems()}
          activeKey={activeTabKey}
          onChange={(key: string) => setActiveTabKey(key)}
        />
        <FullScreenModal
          open={todoModel}
          centered
          width={'80vw'}
          bodyHeight={'80vh'}
          destroyOnClose
          title={'发起流程'}
          footer={[]}
          onCancel={() => setTodoModel(!todoModel)}>
          {activeTabKey == '1' && (
            <TaskStart
              current={current}
              finished={finished}
              data={editCurrent.data || data}
              saveDraft={(data: schema.XdraftsColl) => {
                let obj = {
                  typeName: '草稿箱',
                  data: data,
                  relations: '',
                };
                orgCtrl.user.draftsColl.insert(obj).then((res) => {
                  setTodoModel(!todoModel);
                });
              }}
              // <WorkForm
              //   allowEdit={false}
              //   belong={editCurrent.belong}
              //   nodeId={editCurrent.data?.node?.id}
              //   data={editCurrent.data}
              // />
            />
          )}
          {activeTabKey == '2' && (
            <Content
              current={editCurrent as any}
              finished={finished}
              key={editCurrent.key}
            />
          )}
        </FullScreenModal>
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Empty />
    </div>
  );
};

export default MultitabTable;
