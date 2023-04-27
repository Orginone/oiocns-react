import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Card, message } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import { SaveOutlined } from '@ant-design/icons';
import { OperationModel } from '@/ts/base/model';
import { kernel } from '@/ts/base';
import Design from './design';

interface Iprops {
  target?: ITarget;
  current: ISpeciesItem;
  operation: XOperation;
  onBack: () => void;
}

/*
  表单设计
*/
const SpeciesFormDesign: React.FC<Iprops> = (props: Iprops) => {
  const { current, operation, onBack } = props;
  const [operationModel, setOperationModel] = useState<OperationModel>();

  const save = async () => {
    if (operationModel) {
      if (operationModel.belongId === current.team.space.id) {
        const res = await kernel.updateOperation(operationModel);
        console.log(res);
      }
      const res = await kernel.createOperationItems({
        spaceId: current.team.space.id,
        operationId: operationModel.id!,
        operationItems: operationModel.items
          .filter(
            (i: any) => i.belongId == undefined || i.belongId == current.team.space.id,
          )
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
              onBack();
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
      />
    </Card>
  );
};

export default SpeciesFormDesign;
