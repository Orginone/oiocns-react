import { kernel, model } from '@/ts/base';
import { OperationModel } from '@/ts/base/model';
import { XOperation, XOperationItem } from '@/ts/base/schema';
import { ITarget } from '@/ts/core';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import { Modal } from 'antd';
import { FRGeneratorProps } from 'fr-generator';
import React, { useEffect } from 'react';
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

// 表单提交校验
// const valid = (schema: any): boolean => {
//   return false;
// };

/*
  表单设计模态框
*/
const FormDesignModal = (props: FormDesignModalProps) => {
  let { title, open, data, handleCancel, handleOk, current } = props;

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
      spaceId: userCtrl.space.id,
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
    for (const key in schema.properties) {
      if (Object.prototype.hasOwnProperty.call(schema.properties, key) && key) {
        const element = schema.properties[key];
        if (isNumber(Number(key))) {
          // 在 operationItems 是否存在
          operationItems.forEach((item) => {
            if (key === item.id && item.id) {
              const updateItem: model.OperationItemModel = {
                id: item.id,
                name: element.title,
                code: element.bind || key,
                rule: JSON.stringify(element),
                remark: element.type,
                belongId: userCtrl.space.id,
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
            belongId: userCtrl.space.id,
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
    const updateItemIds = updateItems.map((item) => item.id);
    const ids = operationItems
      .filter((i) => !updateItemIds.includes(i.id) && i.id)
      .map((i) => i.id);
    deleteItemIds.clear();
    for (const id of ids) {
      deleteItemIds.add(id);
    }
    createItems = createItems.filter((i) => !updateItemIds.includes(i.id));
  };
  // 保存
  const save = async () => {
    const allItems: XOperationItem[] = [];
    for (const item of createItems) {
      item.id = undefined;
      const res = await kernel.createOperationItem(item);
      allItems.push(res.data);
    }
    for (const item of updateItems) {
      const res = await kernel.updateOperationItem(item);
      allItems.push(res.data);
    }
    // TODO 删除时判断归属权限
    deleteItemIds.forEach(async (id) => {
      const res = await kernel.deleteOperationItem({
        id,
        typeName: '',
      });
      console.log(res);
    });
    operationItems = allItems;
    if (allItems.length > 0) {
      schema.properties = {};
      for (const item of allItems) {
        schema.properties[item.id] = JSON.parse(item.rule);
      }
    }

    const body: OperationModel = {
      id: data?.id,
      name: data?.name as string,
      code: data?.code as string,
      public: data?.public as boolean,
      remark: JSON.stringify(schema),
      belongId: data?.belongId as string,
      speciesId: data.speciesId,
    };
    // 修改
    const result = await current.updateOperation(body);
    handleOk(result);
  };
  return (
    <Modal
      title={title}
      open={open}
      onOk={async () => save()}
      onCancel={handleCancel}
      maskClosable={false}
      width={1280}>
      <div style={{ paddingTop: '14px' }}>
        <FormDesign
          defaultValue={schema}
          onSchemaChange={(newSchema) => {
            if (newSchema) {
              refresh(newSchema);
            }
          }}
          current={current}
        />
      </div>
    </Modal>
  );
};

export default FormDesignModal;
