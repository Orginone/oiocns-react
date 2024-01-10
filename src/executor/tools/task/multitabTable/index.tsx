import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';
import { IWork, IWorkApply, IWorkTask } from '@/ts/core';
import { model } from '@/ts/base';
import ListTable from './listTable';

interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
  data?: model.InstanceDataModel;
  activeKey?: string | number
  tabTableData?: []
}

const tabData = [
  {
    "label": "草稿箱", "key": 1, "tableHeader": [], "tableData": [],
    "buttonList": [
      { "title": "新增", "type": "add" },
      { "title": "编辑", "type": "edit" },
      { "title": "查看", "type": "detail" }
    ]
  },
  { "label": "已发起", "key": 2, "tableHeader": [], "tableData": [] },
  { "label": "已办结", "key": 3,"tableHeader": [], "tableData": [] }
];

/** 多tab表格 */
const MultitabTable: React.FC<IProps> = ({ current, data, finished, activeKey = 1, tabTableData = tabData }) => {
  const [activeTabKey, setActiveTabKey] = useState(activeKey);
  const loadItems = () => {
    const items = [];
    for (let i = 0; i < tabTableData.length; i++) {
      items.push({
        key: tabTableData[i].key,
        forceRender: true,
        label: tabTableData[i].label,
        children: <ListTable {...current} tableConfig={tabTableData[i]} />,
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
    </div>
  );
};

export default MultitabTable;