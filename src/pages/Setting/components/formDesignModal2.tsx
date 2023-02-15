import React, { useState } from 'react';
import { Modal } from 'antd';
import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem, ITarget } from '@/ts/core';
import Design from './design/index';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

interface FormDesignModalProps {
  title: string;
  open: boolean;
  data: XOperation;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: ISpeciesItem;
  target?: ITarget;
}

const FormDesignModal2: React.FC<FormDesignModalProps> = (
  props: FormDesignModalProps,
) => {
  let { open, data, handleCancel, handleOk, current } = props;
  const [saveOperationItems, setSaveOperationItems] = useState<any[]>([]);

  const save = async () => {
    // 排序
    let i = 1;
    for (const item of saveOperationItems) {
      item.remark = `${i}`;
      i++;
    }
    const res = await kernel.queryOperationItems({
      id: data.id,
      spaceId: userCtrl.space.id,
      page: { offset: 0, limit: 100000, filter: '' },
    });
    const dbOperationItems = res.data.result || [];
    const saveCodes = saveOperationItems.map((item) => item.code);
    const dbCodes = dbOperationItems.map((i) => i.code);
    // 删除
    const delItems = dbOperationItems.filter((i) => !saveCodes.includes(i.code));
    for (const item of delItems) {
      const res = await kernel.deleteOperationItem({
        id: item.id,
        typeName: '',
      });
      console.log(res);
    }
    // 新增
    const createItems = saveOperationItems.filter((i) => !dbCodes.includes(i.code));
    for (const item of createItems) {
      item.id = undefined;
      const res = await kernel.createOperationItem(item);
      console.log(res);
    }
    // 修改
    const updateItems = saveOperationItems.filter((i) => dbCodes.includes(i.code));
    for (const item of updateItems) {
      const res = await kernel.updateOperationItem(item);
      console.log(res);
    }
    console.log('delItems', delItems);
    console.log('create', createItems);
    console.log('updateItems', updateItems);
  };

  return (
    <Modal
      title={`表单设计`}
      open={open}
      onOk={async () => save()}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
      width={1280}>
      <Design
        operation={data}
        handleCancel={handleCancel}
        handleOk={handleOk}
        current={current}
        setSaveOperationItems={setSaveOperationItems}
      />
    </Modal>
  );
};

export default FormDesignModal2;
