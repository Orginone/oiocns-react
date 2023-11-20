import { IWork, IWorkTask } from '@/ts/core';
import { Button, Empty, Input, Spin } from 'antd';
import message from '@/utils/message';
import React from 'react';
import WorkForm from '@/executor/tools/workForm';
import FullScreenModal from '@/components/Common/fullScreen';
import { model } from '@/ts/base';
import useAsyncLoad from '@/hooks/useAsyncLoad';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
  finished: () => void;
}

/** 办事-业务流程--发起 */
const WorkStartDo: React.FC<IProps> = ({ current, finished }) => {
  const [loaded, apply] = useAsyncLoad(() => current.createApply());
  const info: { content: string } = { content: '' };
  const formData = new Map<string, model.FormEditData>();
  const loadContent = () => {
    if (!loaded) {
      return (
        <Spin tip={'配置信息加载中...'}>
          <div style={{ width: '100%', height: '100%' }}></div>
        </Spin>
      );
    }
    if (apply) {
      return (
        <>
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
                if (apply.validation(formData)) {
                  await apply.createApply(apply.belong.id, info.content, formData);
                  finished();
                } else {
                  message.warn('请完善表单内容再提交!');
                }
              }}>
              提交
            </Button>
          </div>
        </>
      );
    }
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Empty />
      </div>
    );
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
        title={apply?.metadata.title ?? '加载中...'}
        footer={[]}
        onCancel={finished}>
        {loadContent()}
      </FullScreenModal>
    </>
  );
};

export default WorkStartDo;
