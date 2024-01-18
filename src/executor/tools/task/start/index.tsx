import { IWork, IWorkApply, IWorkTask } from '@/ts/core';
import { Button, Empty, Input, Spin } from 'antd';
import message from '@/utils/message';
import React, { useState } from 'react';
import WorkForm from '@/executor/tools/workForm';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { loadGatewayNodes } from '@/utils/tools';
import FormItem from '@/components/DataStandard/WorkForm/Viewer/formItem';
import { Emitter } from '@/ts/base/common';
import { model, schema } from '@/ts/base';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
  data?: model.InstanceDataModel;
  saveDraft?: (data: any, content: string) => void;
  content?: string;
}

/** 办事-业务流程--发起 */
const TaskStart: React.FC<IProps> = ({
  current,
  data,
  finished,
  saveDraft,
  content = '',
}) => {
  console.log('content', content);
  const gatewayData = new Map<string, string>();
  const [notifyEmitter] = React.useState(new Emitter());
  const [loaded, apply] = useAsyncLoad(() => current.createApply(undefined, data));
  const info: { content: string } = { content: '' };
  const loadGateway = (apply: IWorkApply) => {
    const gatewayInfos = loadGatewayNodes(apply.instanceData.node, []);
    return (
      <>
        {gatewayInfos.map((a) => {
          return (
            <FormItem
              rules={[]}
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
              onValuesChange={(field, data) => {
                gatewayData.set(field, data);
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
        />
        {loadGateway(apply)}
        <div style={{ padding: 10, display: 'flex', alignItems: 'flex-end' }}>
          <Input.TextArea
            style={{ height: 100, width: 'calc(100% - 80px)', marginRight: 10 }}
            placeholder="请填写备注信息"
            defaultValue={content}
            onChange={(e) => {
              info.content = e.target.value;
            }}
          />
          <Button
            type="primary"
            onClick={async () => {
              if (apply.validation()) {
                await apply.createApply(apply.belong.id, info.content, gatewayData);
                finished?.apply(this, []);
              } else {
                message.warn('请完善表单内容再提交!');
              }
            }}>
            提交
          </Button>
          {saveDraft && (
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={async () => {
                saveDraft(apply.instanceData, info.content);
              }}>
              保存草稿
            </Button>
          )}
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
