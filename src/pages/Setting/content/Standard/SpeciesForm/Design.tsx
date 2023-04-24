import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem } from '@/ts/core';
import { Button, Card, message } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import Design from '../../../components/design/index';
import { AiOutlineSave } from 'react-icons/ai';
import { OperationModel } from '@/ts/base/model';
import { kernel } from '@/ts/base';

interface Iprops {
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

  return (
    <Card
      title={operation?.name}
      extra={
        <>
          <Button
            onClick={async () => {
              if (operationModel) {
                if (operationModel.belongId === current.team.id) {
                  await kernel.updateOperation(operationModel);
                }
                if (
                  (
                    await kernel.createOperationItems({
                      spaceId: current.team.id,
                      operationId: operationModel.id!,
                      operationItems: operationModel.items
                        .filter((i: any) => i.belongId == current.team.id)
                        .map((a) => ({
                          name: a.name,
                          code: a.code,
                          attrId: a.attrId,
                          rule: a.rule,
                          remark: a.remark,
                          speciesIds: a.speciesIds || [],
                        })),
                    })
                  ).success
                ) {
                  message.success('保存成功！');
                  setTabKey(0);
                }
              }
            }}
            type="primary"
            icon={<AiOutlineSave />}
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
