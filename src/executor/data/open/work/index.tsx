import { IWork } from '@/ts/core';
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import WorkForm from '@/executor/tools/workForm';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IWorkApply } from '@/ts/core';
import { model } from '@/ts/base';
import { DataType } from 'typings/globelType';
// 卡片渲染
interface IProps {
  current: IWork;
  finished: () => void;
}

/** 办事-业务流程--发起 */
const WorkStartDo: React.FC<IProps> = ({ current, finished }) => {
  const [apply, setApply] = useState<IWorkApply>();
  const info: { content: string } = { content: '' };
  const formData = new Map<string, model.FormEditData>();
  useEffect(() => {
    current.createApply().then((value) => {
      if (value) {
        setApply(value);
      }
    });
  }, [current]);
  if (!apply) return <></>;
  function resolveFormChange(id: string, data: DataType, _changedData?: DataType) {
    formData.set(id, data as any);
    console.log('表单变化打印', 'Start', data, id, _changedData);
  }
  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        bodyHeight={'80vh'}
        destroyOnClose
        title={current.name}
        footer={[]}
        onCancel={finished}>
        <WorkForm
          allowEdit
          belong={apply.belong}
          data={apply.instanceData}
          nodeId={apply.instanceData.node.id}
          formRule={apply.instanceData?.formRules}
          onChanged={(id, data, changedData) => {
            formData.set(id, data);
            resolveFormChange(id, data, changedData);
          }}
        />
        <div style={{ padding: 10, display: 'flex', alignItems: 'flex-end' }}>
          <Input.TextArea
            style={{ height: 100, width: 'calc(100% - 80px)', marginRight: 10 }}
            placeholder="请填写备注信息"
            onChange={(e) => {
              info.content = e.target.value;
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              console.log('提交打印所有规则', apply.instanceData.formRules, formData);

              // apply.createApply(apply.belong.id, info.content, formData);
              // finished();
            }}>
            提交
          </Button>
        </div>
      </FullScreenModal>
    </>
  );
};

export default WorkStartDo;
