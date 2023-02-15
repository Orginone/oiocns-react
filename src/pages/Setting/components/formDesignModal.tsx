import { kernel, model } from '@/ts/base';
import { OperationModel } from '@/ts/base/model';
import { XOperation, XOperationItem } from '@/ts/base/schema';
import { ITarget } from '@/ts/core';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import { Modal, TreeSelect } from 'antd';
import { FRGeneratorProps } from 'fr-generator';
import React, { useEffect, useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import { isNumber } from '@/ts/base/common';
import FormDesign from './formDesign';

interface FormDesignModalProps extends FRGeneratorProps {
  title: string;
  open: boolean;
  data: XOperation;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: ISpeciesItem;
  target?: ITarget;
}

/*
  表单设计模态框
*/
const FormDesignModal = (props: FormDesignModalProps) => {
  let { title, open, data, handleCancel, handleOk, current } = props;
  const [belongId, setBelongId] = useState<string>(userCtrl.space.id);

  const [treeData, setTreeData] = useState<any[]>();

  useEffect(() => {
    const loadTeam = async () => {
      const res = await userCtrl.getTeamTree();
      setTreeData(res);
    };
    loadTeam();
  }, []);

  data = data as XOperation;
  let schema: any = undefined;
  if (data?.remark) {
    schema = JSON.parse(data?.remark);
  }
  let operationItems: XOperationItem[] = [];
  let createItems: model.OperationItemModel[] = [];
  let updateItems: model.OperationItemModel[] = [];
  let deleteItemIds: Set<string> = new Set();

  const queryItems = async () => {
    const res = await kernel.queryOperationItems({
      id: data.id,
      spaceId: belongId,
      page: { offset: 0, limit: 100000, filter: '' },
    });
    operationItems = res.data.result || [];
  };
  useEffect(() => {
    if (open) {
      queryItems();
    }
  });
  // 刷新Items
  const refresh = (newSchema: any) => {
    schema = newSchema;
    console.log('newSchema', newSchema);
    const keys: string[] = [];
    for (const key in schema.properties) {
      if (Object.prototype.hasOwnProperty.call(schema.properties, key) && key) {
        const element = schema.properties[key];
        if (isNumber(Number(key))) {
          keys.push(key);
          // 在 operationItems 是否存在
          operationItems.forEach((item) => {
            if (key === item.id && item.id) {
              const updateItem: model.OperationItemModel = {
                id: item.id,
                name: element.title,
                code: element.bind || key,
                rule: JSON.stringify(element),
                remark: element.type,
                belongId,
                operationId: data.id,
              };
              let index = updateItems.findIndex((i) => i.id === updateItem.id);
              if (index === -1) {
                updateItems.push(updateItem);
              } else {
                updateItems[index] = updateItem;
              }
            }
          });
        } else {
          const createItem: model.OperationItemModel = {
            id: key,
            name: element.title,
            code: element.bind || key,
            rule: JSON.stringify(element),
            remark: element.type,
            belongId,
            operationId: data.id,
          };
          let index = createItems.findIndex((i) => i.id === createItem.id);
          if (index === -1) {
            createItems.push(createItem);
          } else {
            createItems[index] = createItem;
          }
        }
      }
    }
    const ids = operationItems
      .filter((i) => !keys.includes(i.id) && i.id)
      .map((i) => i.id);
    deleteItemIds.clear();
    for (const id of ids) {
      deleteItemIds.add(id);
    }
    createItems = createItems.filter((i) => !keys.includes(i.id as string));

    console.log('createItems', createItems);
    console.log('updateItems', updateItems);
    console.log('deleteItemIds', deleteItemIds);
  };

  const save = async () => {
    handleOk(true);
  };
  // // 保存
  // const save = async () => {
  //   for (const item of createItems) {
  //     item.id = undefined;
  //     const res = await kernel.createOperationItem(item);
  //     schema.properties[res.data.id] = JSON.parse(item.rule);
  //   }
  //   for (const item of updateItems) {
  //     schema.properties[item.id as string] = JSON.parse(item.rule);
  //     const res = await kernel.updateOperationItem(item);
  //     console.log(res);
  //   }
  //   // TODO 删除时判断归属权限
  //   deleteItemIds.forEach(async (id) => {
  //     const res = await kernel.deleteOperationItem({
  //       id,
  //       typeName: '',
  //     });
  //     console.log(res);
  //     delete schema.properties[id];
  //   });
  //   const ids: string[] = [];
  //   for (const key in schema.properties) {
  //     if (Object.prototype.hasOwnProperty.call(schema.properties, key) && key) {
  //       if (isNumber(Number(key))) {
  //         ids.push(key);
  //         const element = schema.properties[key];
  //         for (const item of operationItems) {
  //           if (item.id === key) {
  //             item.name = element.title;
  //             item.code = element.bind || key;
  //             item.rule = JSON.stringify(element);
  //             item.remark = element.type;
  //           }
  //         }
  //       } else {
  //         delete schema.properties[key];
  //       }
  //     }
  //   }
  //   operationItems = operationItems.filter((i) => ids.includes(i.id));

  //   const body: OperationModel = {
  //     id: data?.id,
  //     name: data?.name as string,
  //     code: data?.code as string,
  //     public: data?.public as boolean,
  //     remark: JSON.stringify(schema),
  //     belongId: data?.belongId as string,
  //     speciesId: data.speciesId,
  //   };
  //   console.log('speciesId', body.speciesId);
  //   // // 修改
  //   const result = await current.updateOperation(body);
  //   handleOk(result);
  // };
  return (
    <Modal
      title={title}
      open={open}
      destroyOnClose={true}
      onOk={async () => save()}
      onCancel={handleCancel}
      maskClosable={false}
      width={1280}>
      <div style={{ padding: '8px' }}>
        <label>制定组织：</label>
        <TreeSelect
          style={{ width: '30%' }}
          defaultValue={userCtrl.space.id}
          value={belongId}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="请选择制定组织"
          fieldNames={{ label: 'teamName', value: 'id', children: 'subTeam' }}
          onChange={(value) => setBelongId(value)}
        />
      </div>
      <FormDesign
        defaultValue={schema}
        onSchemaChange={(newSchema) => {
          if (newSchema) {
            refresh(newSchema);
          }
        }}
        current={current}
      />
    </Modal>
  );
};

export default FormDesignModal;
