import GenerateThingTable from '@/executor/tools/generate/thingTable';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Tabs } from 'antd';
import CustomStore from 'devextreme/data/custom_store';
import React, { useState } from 'react';

interface IProps {
  transfer: ITransfer;
  current: model.Store;
}

const DataTables: React.FC<IProps> = ({ transfer, current }) => {
  const [curTab, setCurTab] = useState<string>();
  return (
    <Tabs
      activeKey={curTab}
      onChange={setCurTab}
      items={Object.keys(transfer.forms).map((key) => {
        const form = transfer.forms[key];
        const data = transfer.curTask?.visitedNodes.get(current.id)?.data;
        return {
          key: key,
          label: form?.name,
          children: (
            <GenerateThingTable
              fields={form.fields}
              height={'70vh'}
              selection={{
                mode: 'multiple',
                allowSelectAll: true,
                selectAllMode: 'page',
                showCheckBoxesMode: 'always',
              }}
              dataIndex="attribute"
              dataSource={
                new CustomStore({
                  key: 'Id',
                  async load(_) {
                    return {
                      data: data[key] ?? [],
                      totalCount: data[key]?.length ?? 0,
                    };
                  },
                })
              }
              remoteOperations={true}
            />
          ),
        };
      })}
    />
  );
};

export { DataTables };
