import { IWork, IWorkApply, IWorkTask } from '@/ts/core';
import { Button, Empty, Input, Spin } from 'antd';
import message from '@/utils/message';
import React from 'react';
import WorkForm from '@/executor/tools/workForm';
import { model } from '@/ts/base';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { loadGatewayNodes } from '@/utils/tools';
import FormItem from '@/components/DataStandard/WorkForm/Viewer/formItem';
import { Emitter } from '@/ts/base/common';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
}

/** 办事-业务流程--发起 */
const TaskStart: React.FC<IProps> = ({ current, finished }) => {
  const formData = new Map<string, model.FormEditData>();
  const gatewayData = new Map<string, string>();
  const [notifyEmitter] = React.useState(new Emitter());
  const [loaded, apply] = useAsyncLoad(() => current.createApply());
  const info: { content: string } = { content: '' };

  const loadGateway = (apply: IWorkApply) => {
    const gatewayInfos = loadGatewayNodes(apply.instanceData.node, []);
    return (
      <>
        {gatewayInfos.map((a) => {
          return (
            <FormItem
              key={a.id}
              data={gatewayData}
              numStr={'1'}
              field={{
                id: a.id,
                code: a.code,
                name: a.name,
                valueType: '用户型',
                widget: '成员选择框',
                remark: '',
                options: {
                  teamId: current.directory.target.id,
                },
              }}
              belong={current.directory.target.space}
              notifyEmitter={notifyEmitter}
              onValuesChange={(_, data) => {
                Object.keys(data).forEach((a) => {
                  gatewayData.set(a, data[a]);
                });
              }}
            />
          );
        })}
      </>
    );
  };
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
        {loadGateway(apply)}
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
                await apply.createApply(
                  apply.belong.id,
                  info.content,
                  formData,
                  gatewayData,
                );
                finished?.apply(this, []);
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

export default TaskStart;
