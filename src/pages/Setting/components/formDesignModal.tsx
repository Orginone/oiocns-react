// import { kernel, model } from '@/ts/base';
// import { OperationModel } from '@/ts/base/model';
// import { XOperation, XOperationItem } from '@/ts/base/schema';
// import { ITarget } from '@/ts/core';
// import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
// import { Modal } from 'antd';
// import Generator, { FRGeneratorProps, defaultSettings } from 'fr-generator';
// import React, { useEffect } from 'react';
// import userCtrl from '@/ts/controller/setting';
import { OperationModel } from '@/ts/base/model';
import { XOperation } from '@/ts/base/schema';
import { ITarget } from '@/ts/core';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import { Modal } from 'antd';
import Generator, { FRGeneratorProps, defaultSettings } from 'fr-generator';
import React from 'react';

interface FormDesignProps extends FRGeneratorProps {
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

// 自定义扩展组件
const widgets: any[] = [
  {
    text: '分类特性',
    name: 'attr',
    schema: { title: '分类特性', type: 'string' },
  },
  {
    text: '分类字典',
    name: 'dict',
    schema: { title: '分类字典', type: 'string', widget: 'select' },
  },
  {
    text: '资产统计',
    name: 'stat',
    schema: { title: '资产统计', type: 'number' },
  },
  {
    text: '价值求和',
    name: 'sum',
    schema: { title: '价值求和', type: 'number' },
  },
];
const settings = [
  { show: true, title: '平台组件(自定义扩展)', useCommon: true, widgets },
  ...defaultSettings,
];

/*
  表单设计模态框
*/
const FormDesignModal = (props: FormDesignProps) => {
  let { title, open, data, handleCancel, handleOk, current } = props;
  data = data as XOperation;
  let schema: any = undefined;
  if (data?.remark) {
    schema = JSON.parse(data?.remark);
  }
  // let operationItems: XOperationItem[] = [];
  // let createItems: model.OperationItemModel[] = [];
  // let updateItems: model.OperationItemModel[] = [];
  // let deleteItemIds: Set<string> = new Set();

  // const queryItems = async () => {
  //   const res = await kernel.queryOperationItems({
  //     id: data.id,
  //     spaceId: userCtrl.space.id,
  //     page: { offset: 0, limit: 100000, filter: '' },
  //   });
  //   operationItems = res.data.result || [];
  // };
  // useEffect(() => {
  //   if (open) {
  //     queryItems();
  //   }
  // });
  // 刷新Items
  // const refresh = (newSchema: any) => {
  //   schema = newSchema;
  //   for (const key in schema.properties) {
  //     if (Object.prototype.hasOwnProperty.call(schema.properties, key) && key) {
  //       const element = schema.properties[key];
  //       console.log('element', element);
  //       console.log('key', key);
  //       let exist = false;
  //       operationItems.forEach((item) => {
  //         if (key === item.id) {
  //           exist = true;
  //           item = element;
  //           const updateItem: model.OperationItemModel = {
  //             id: item.id,
  //             name: element.title,
  //             code: element.bind || key,
  //             rule: JSON.stringify(element),
  //             remark: element.type,
  //             belongId: userCtrl.space.id,
  //             operationId: data.id,
  //           };
  //           updateItems.push(updateItem);
  //         }
  //       });
  //       if (!exist) {
  //         const createItem: model.OperationItemModel = {
  //           id: key,
  //           name: element.title,
  //           code: element.bind || key,
  //           rule: JSON.stringify(element),
  //           remark: element.type,
  //           belongId: userCtrl.space.id,
  //           operationId: data.id,
  //         };
  //         let index = createItems.findIndex((i) => i.id === createItem.id);
  //         if (index === -1) {
  //           createItems.push(createItem);
  //         } else {
  //           createItems[index] = createItem;
  //         }
  //       }
  //     }
  //   }
  //   const updateItemIds = updateItems.map((item) => item.id);
  //   const ids = operationItems
  //     .filter((i) => !updateItemIds.includes(i.id) && i.id)
  //     .map((i) => i.id);
  //   for (const id of ids) {
  //     deleteItemIds.add(id);
  //   }
  //   console.log(createItems);
  //   console.log(updateItems);
  //   console.log(deleteItemIds);
  // };
  // 保存
  const save = async () => {
    // const allItems: XOperationItem[] = [];
    // for (const item of createItems) {
    //   item.id = undefined;
    //   const res = await kernel.createOperationItem(item);
    //   allItems.push(res.data);
    // }
    // for (const item of updateItems) {
    //   item.id = undefined;
    //   const res = await kernel.updateOperationItem(item);
    //   allItems.push(res.data);
    // }
    // console.log('allItems', allItems);
    // operationItems = allItems;
    // if (allItems.length > 0) {
    //   schema.properties = {};
    //   for (const item of allItems) {
    //     schema.properties[item.id] = JSON.parse(item.rule);
    //   }
    // }
    // console.log('schema', schema);

    const body: OperationModel = {
      id: data?.id,
      name: data?.name as string,
      code: data?.code as string,
      public: data?.public as boolean,
      // remark: JSON.stringify(schema),
      remark: data.remark,
      belongId: data?.belongId as string,
      speciesId: '',
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
        <Generator
          defaultValue={schema}
          settings={settings}
          onSchemaChange={(newSchema) => {
            if (newSchema) {
              // TODO 保留旧remark; 删除时判断归属权限; 加载子表并赋予ID
              data = { ...data, ...{ remark: JSON.stringify(newSchema) as string } };
              // refresh(newSchema);
            }
          }}
        />
      </div>
    </Modal>
  );
};

export default FormDesignModal;
