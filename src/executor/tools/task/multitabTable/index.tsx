import { Tabs, Spin, Empty } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import { IWork, IWorkTask, TaskTypeName } from '@/ts/core';
import { model } from '@/ts/base';
import ListTable from './listTable';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { getNodeByNodeId } from '@/utils/tools';
import FullScreenModal from '@/components/Common/fullScreen';
import TaskStart from '@/executor/tools/task/start';
import orgCtrl from '@/ts/controller';
import Content from '@/executor/tools/task';
interface Itable {
  label: string;
  key: string;
  tableHeader: model.FieldModel[];
  tableData: any[];
}
interface IProps {
  current: IWork | IWorkTask;
  finished: () => void;
  data?: model.InstanceDataModel;
  activeKey?: string;
}

/** 多tab表格 */
const MultitabTable: React.FC<IProps> = ({
  current,
  data,
  finished,
  activeKey = '1',
}) => {
  const [editCurrent, setEditCurrent] = useState<model.DraftsType>(
    {} as model.DraftsType,
  );
  let tabData: Array<Itable> = [
    { label: '草稿箱', key: '1', tableHeader: [], tableData: [] },
    { label: '已发起', key: '2', tableHeader: [], tableData: [] },
    { label: '已办结', key: '3', tableHeader: [], tableData: [] },
  ];
  const [tabTableData, setTabTableData] = useState(tabData);
  const [activeTabKey, setActiveTabKey] = useState(activeKey);
  const [loaded, apply] = useAsyncLoad(() => current.createApply(undefined, data));
  const [todoModel, setTodoModel] = useState(false);
  const [types, setTypes] = useState('add');

  useEffect(() => {
    const tags = ['草稿', '发起的', '已办'];
    let index = Number(activeTabKey) - 1;
    if (index == 0) {
      getDrafts();
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
            return task.taskdata.defineId == current.metadata.id;
          });
        const promiseAll = newTasks.map((item) => {
          return item.loadInstance(true);
        });
        Promise.all(promiseAll).then(() => {
          const newTabTableData = [...tabTableData];
          newTabTableData[index].tableData = newTasks;
          setTabTableData(newTabTableData);
        });
      });
    }
  }, [activeTabKey]);

  const getDrafts = (type?: boolean) => {
    orgCtrl.user.draftsColl.all(type).then((res) => {
      const newTabTableData = [...tabTableData];
      newTabTableData[0].tableData = res
        .sort((a, b) => {
          return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
        })
        .filter((item) => item.workId == current.id)
        .map((item) => {
          item.name = current.name;
          return item;
        });
      setTabTableData(newTabTableData);
    });
  };

  const handleChange = (val: any, type: string) => {
    if (type != 'add' && !val.selectedRowsData) return;
    const curr = tabTableData[Number(activeTabKey) - 1].tableData.filter((task) => {
      return task?.id == val.selectedRowsData[0].id;
    });
    setEditCurrent(curr[0]);
    switch (type) {
      case 'remove':
        orgCtrl.user.draftsColl.remove(curr[0]).then(() => {
          getDrafts(true);
          setTypes('remove');
        });
        break;
      case 'edit':
        setTypes('edit');
        setTodoModel(!todoModel);
        break;
      default:
        setTypes('add');
        setEditCurrent({} as model.DraftsType);
        setTodoModel(!todoModel);
    }
  };

  const createData = (data: model.InstanceDataModel, contentText: string) => {
    let obj = {
      ...current.metadata,
      data: data,
      relations: '',
      workId: current.id,
      contentText: contentText,
      typeName: '草稿箱',
      id: '',
    };
    orgCtrl.user.draftsColl.insert(obj).then(() => {
      setTodoModel(!todoModel);
      getDrafts(true);
    });
  };
  const clearModel = () => {
    orgCtrl.user.draftsColl.remove(editCurrent).then(() => {
      getDrafts(true);
      setTodoModel(!todoModel);
    });
  };
  if (!loaded) {
    return (
      <Spin tip={'配置信息加载中...'}>
        <div style={{ width: '100%', height: '100%' }}></div>
      </Spin>
    );
  }
  if (apply) {
    const node = getNodeByNodeId(apply.instanceData.node.id, apply.instanceData.node);
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
        });
      }
      return items;
    };
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Tabs
          style={{ position: 'absolute', left: '10px', top: '50px', zIndex: '2' }}
          items={loadItems()}
          activeKey={activeTabKey}
          onChange={(key: string) => setActiveTabKey(key)}
        />
        <ListTable
          {...current}
          tableConfig={tabTableData[Number(activeTabKey) - 1]}
          handleChange={handleChange}
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
          {activeTabKey === '1' ? (
            <TaskStart
              current={current}
              finished={clearModel}
              data={editCurrent?.data || data}
              content={editCurrent.contentText}
              saveDraft={(data: model.InstanceDataModel, contentText: string) => {
                if (types === 'edit') {
                  editCurrent.data = data;
                  if (contentText) {
                    editCurrent.contentText = contentText;
                  }
                  orgCtrl.user.draftsColl.replace(editCurrent).then(() => {
                    setTodoModel(!todoModel);
                    getDrafts(true);
                  });
                } else if (types == 'add') {
                  createData(data, contentText);
                }
              }}
            />
          ) : (
            <Content
              current={editCurrent as any}
              finished={finished}
              key={editCurrent.id}
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
