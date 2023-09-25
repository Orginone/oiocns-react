import GenerateThingTable from '@/executor/tools/generate/thingTable';
import { model } from '@/ts/base';
import { ITransfer, IForm } from '@/ts/core';
import { Tabs } from 'antd';
import CustomStore from 'devextreme/data/custom_store';
import React, { useState, useEffect } from 'react';

interface IProps {
  transfer: ITransfer;
  current: model.Store;
}

const loadFields = async (transfer: ITransfer, current: model.Store) => {
  const map: { [key: string]: model.FieldModel[] } = {};
  const forms = current.formIds.map((formId) => {
    return transfer.findMetadata<IForm>(formId + '*');
  });
  for (const form of forms) {
    if (form) {
      await form?.loadContent();
      map[form.id] = form.fields;
    }
  }
  return map;
};

const DataTables: React.FC<IProps> = ({ transfer, current }) => {
  const [curTab, setCurTab] = useState<string>();
  const [fieldsMap, setFieldsMap] = useState<{ [key: string]: model.FieldModel[] }>({});
  const [notInit, setNotInit] = useState<boolean>(true);
  useEffect(() => {
    if (notInit) {
      loadFields(transfer, current).then((res) => {
        setFieldsMap(res);
        setNotInit(false);
      });
    }
  });
  return (
    <Tabs
      activeKey={curTab}
      onChange={setCurTab}
      items={current.formIds.map((key) => {
        const form = transfer.findMetadata<IForm>(key);
        const data = transfer.curTask?.visitedNodes.get(current.id)?.data;
        return {
          key: key,
          label: form?.name,
          children: (
            <GenerateThingTable
              fields={fieldsMap[key] ?? []}
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
                      data: data ?? [],
                      totalCount: data?.length ?? 0,
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
