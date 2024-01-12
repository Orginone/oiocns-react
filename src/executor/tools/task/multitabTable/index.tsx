import { Tabs, Spin, Empty } from 'antd';
import { useState } from 'react';
import React from 'react';
import { IWork, IWorkTask } from '@/ts/core';
import { model } from '@/ts/base';
import ListTable from './listTable';
import { kernel } from '@/ts/base';
import CustomStore from 'devextreme/data/custom_store';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { getNodeByNodeId } from '@/utils/tools';
import { command } from '@/ts/base';
import FullScreenModal from '@/components/Common/fullScreen';
import TaskStart from '@/executor/tools/task/start';

interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
  data?: model.InstanceDataModel;
  activeKey?: string | number;
  tabTableData?: any;
}

/** 多tab表格 */
const MultitabTable: React.FC<IProps> = ({
  current,
  data,
  finished,
  activeKey = 1,
  tabTableData,
}) => {
  let tabData = [
    {
      label: '草稿箱',
      key: 1,
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
                command.emitter('executor', 'open', current);
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
                setTodoModel(!todoModel);
                command.emitter('executor', 'open', current);
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
                setTodoModel(!todoModel);
                command.emitter('executor', 'open', current);
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
      key: 2,
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
      key: 3,
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
  tabTableData = tabData;
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
    if (node) {
      const form = node.primaryForms[0];
      const res = new CustomStore({
        key: 'id',
        async load(loadOptions: any) {
          let loadOption: any = loadOptions;
          loadOption.belongId = form.belongId;
          let userId = 'F' + form.id;
          loadOption.userData = [];
          loadOption.userData.push(userId);
          const result = await kernel.loadThing(
            form.belongId,
            [form.belongId],
            loadOptions,
          );
          return result;
        },
      });
      res.load().then((res: any) => {
        tabTableData[2].tableData = res;
      });
    }
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
          children: <ListTable {...current} node={node} tableConfig={tabTableData[i]} />,
        });
      }
      return items;
    };
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Tabs
          items={loadItems()}
          activeKey={activeTabKey}
          onChange={(key: any) => setActiveTabKey(key)}
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
          <TaskStart current={current} finished={finished} data={data} />
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
