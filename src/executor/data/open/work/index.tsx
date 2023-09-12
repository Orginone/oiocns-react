import { IWork, IWorkTask } from '@/ts/core';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import WorkForm from '@/executor/tools/workForm';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IWorkApply } from '@/ts/core';
import { model } from '@/ts/base';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
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
  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        bodyHeight={'80vh'}
        destroyOnClose
        title={apply.metadata.title}
        footer={[]}
        onCancel={finished}>
        <WorkForm
          allowEdit
          belong={apply.belong}
          data={apply.instanceData}
          nodeId={apply.instanceData.node.id}
          onChanged={(id, data) => {
            formData.set(id, data);
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
            onClick={async () => {
              let { values = {}, success = true } =
                await apply.ruleService.resloveSubmitRules();
              const changedForm = formData.get(apply.ruleService.currentMainFormId);
              formData.set(apply.ruleService.currentMainFormId!, {
                ...changedForm,
                after: [{ ...changedForm!.after[0]!, ...values }],
              } as any);
              if (success) {
                apply.createApply(apply.belong.id, info.content, formData);
                finished();
              } else {
                message.warning('表单提交规则验证失败，请检查');
              }
            }}>
            提交
          </Button>
        </div>
      </FullScreenModal>
    </>
  );
};

export default WorkStartDo;
