import { IBelong, IWorkTask } from '@/ts/core';
import { Button, Input } from 'antd';
import React from 'react';
import WorkForm from '@/executor/tools/workForm';
import FullScreenModal from '@/components/Common/fullScreen';
import { initApplyData } from '@/utils/anxinwu/axwRule';
import { model } from '@/ts/base';
import orgCtrl from '@/ts/controller';
// 卡片渲染
interface IProps {
  current: IWorkTask;
  finished: () => void;
}

var formdata = new Map<string, model.FormEditData>();
/** 办事-业务流程--发起 */
const Tijiaoren: React.FC<IProps> = ({ current, finished }) => {
  const company = orgCtrl.targets.find((a) => a.id == current.instance!.belongId);
  if (!company) return <></>;
  const info: { content: string } = { content: '' };
  if (current.instanceData) {
    formdata = new Map<string, model.FormEditData>();
    initApplyData(company?.id, current.instanceData, formdata);
  }
  const loadContent = () => {
    if (current.instanceData) {
      return (
        <>
          <WorkForm
            allowEdit={true}
            belong={company as IBelong}
            data={current.instanceData}
            nodeId={current.instanceData.node.id}
            onChanged={(id, data, _changed) => {
              const oldData = formdata.get(id);
              if (oldData) {
                formdata.set(id, {
                  ...oldData,
                  after: [{ ...oldData.after[0], ...data.after[0] }],
                });
              }
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
                if (current.instanceData) {
                  formdata.forEach((data, k) => {
                    current.instanceData!.data[k] = [data];
                  });
                }
                if (await current.approvalTask(100, info.content)) {
                  finished();
                }
              }}>
              提交
            </Button>
          </div>
        </>
      );
    }
    return <></>;
  };
  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        bodyHeight={'80vh'}
        destroyOnClose
        title={current.instance?.title ?? '提交材料'}
        footer={[]}
        onCancel={finished}>
        {loadContent()}
      </FullScreenModal>
    </>
  );
};

export default Tijiaoren;
