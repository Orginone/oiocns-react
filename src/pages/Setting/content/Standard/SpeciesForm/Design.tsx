import { kernel } from '@/ts/base';
import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Card } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import userCtrl from '@/ts/controller/setting';
import Design from '../../../components/design/index';
import { SaveOutlined } from '@ant-design/icons';

interface Iprops {
  target?: ITarget;
  current: ISpeciesItem;
  operation: XOperation;
  setTabKey: (tabKey: number) => void;
}

/*
  表单设计
*/
const SpeciesFormDesign: React.FC<Iprops> = (props: Iprops) => {
  const { target, current, operation, setTabKey } = props;
  const [saveOperationItems, setSaveOperationItems] = useState<any[]>([]);

  const save = async () => {
    // 排序
    let i = 1;
    for (const item of saveOperationItems) {
      item.remark = `${i}`;
      i++;
    }
    const res = await kernel.queryOperationItems({
      id: operation.id,
      spaceId: userCtrl.space.id,
      page: { offset: 0, limit: 100000, filter: '' },
    });
    const dbOperationItems = res.data.result || [];
    const saveCodes = saveOperationItems.map((item) => item.code);
    const dbCodes = dbOperationItems.map((i) => i.code);
    // 删除
    const delItems = dbOperationItems.filter((i) => !saveCodes.includes(i.code));
    // for (const item of delItems) {
    //   const res = await kernel.deleteOperationItem({
    //     id: item.id,
    //     typeName: '',
    //   });
    //   console.log(res);
    // }
    // 新增
    const createItems = saveOperationItems.filter((i) => !dbCodes.includes(i.code));
    // for (const item of createItems) {
    //   item.id = undefined;
    //   const res = await kernel.createOperationItem(item);
    //   console.log(res);
    // }
    // 修改
    const updateItems = saveOperationItems.filter((i) => dbCodes.includes(i.code));
    // for (const item of updateItems) {
    //   const res = await kernel.updateOperationItem(item);
    //   console.log(res);
    // }
    console.log('delItems', delItems);
    console.log('create', createItems);
    console.log('updateItems', updateItems);
  };

  return (
    <Card
      title={operation?.name}
      extra={
        <>
          <Button onClick={() => save()} type="primary" icon={<SaveOutlined />}>
            保存
          </Button>
          <Button
            key="back"
            type="link"
            onClick={() => {
              setTabKey(0);
            }}>
            <div style={{ display: 'flex' }}>
              <div style={{ paddingTop: '2px' }}>
                <ImUndo2 />
              </div>
              <div style={{ paddingLeft: '6px' }}>返回</div>
            </div>
          </Button>
        </>
      }>
      <Design
        operation={operation}
        current={current}
        setSaveOperationItems={setSaveOperationItems}
      />
    </Card>
  );
};

export default SpeciesFormDesign;
