import { kernel } from '@/ts/base';
import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { Button, Card, message } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import Design from '../../../components/design/index';
import { SaveOutlined } from '@ant-design/icons';
import { OperationModel } from '@/ts/base/model';

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
  const [operationModel, setOperationModel] = useState<OperationModel>();

  const save = async () => {
    console.log('operationModel', operationModel);
    if (operationModel) {
      const res = await kernel.publishOperation(operationModel);
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
        setOperationModel={setOperationModel}
      />
    </Card>
  );
};

export default SpeciesFormDesign;
