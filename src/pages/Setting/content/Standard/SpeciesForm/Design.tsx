import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Card, message } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import Design from '../../../components/design/index';
import { SaveOutlined } from '@ant-design/icons';
import { OperationModel } from '@/ts/base/model';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';

interface Iprops {
  target?: ITarget;
  current: ISpeciesItem;
  operation: XOperation;
  toFlowDesign: (operation: XOperation) => void;
  setTabKey: (tabKey: number) => void;
}

/*
  表单设计
*/
const SpeciesFormDesign: React.FC<Iprops> = (props: Iprops) => {
  const { current, operation, setTabKey, toFlowDesign } = props;
  const [operationModel, setOperationModel] = useState<OperationModel>();

  const save = async () => {
    if (operationModel) {
      if (operationModel.belongId === userCtrl.space.id) {
        const res = await kernel.updateOperation(operationModel);
        console.log(res);
      }
      const res = await kernel.createOperationItems({
        spaceId: userCtrl.space.id,
        operationId: operationModel.id!,
        operationItems: operationModel.items
          .filter((i: any) => i.belongId == userCtrl.space.id)
          .map((a) => ({
            name: a.name,
            code: a.code,
            attrId: a.attrId,
            rule: a.rule,
            remark: a.remark,
            speciesIds: a.speciesIds || [],
          })),
      });
      if (res.success) {
        message.success('保存成功！');
      } else {
        message.error(res.msg);
      }
    }
  };

  return (
    <Card
      title={operation?.name}
      extra={
        <>
          <Button
            onClick={() => save()}
            type="primary"
            icon={<SaveOutlined />}
            disabled={!operationModel}>
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
        setOperationModel={setOperationModel}
        toFlowDesign={toFlowDesign}
      />
    </Card>
  );
};

export default SpeciesFormDesign;
