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
  const gatewayData = new Map<string, string>();
  const [notifyEmitter] = React.useState(new Emitter());
  const [loaded, apply] = useAsyncLoad(() => current.createApply(undefined, data));
  const info: { content: string } = { content: '' };
  if (content) {
    info.content = content;
  }
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            position: 'relative',
            top: '16px',
            height: '0px',
            marginRight: '10px',
            zIndex: '1',
          }}>
          {saveDraft && (
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={async () => {
                let text = info.content ? info.content : content;
                saveDraft(apply.instanceData, text);
              }}>
              保存草稿
            </Button>
          )}
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
        </div>
        <WorkForm
          allowEdit
          belong={apply.belong}
          data={apply.instanceData}
          nodeId={apply.instanceData.node.id}
        />
        {loadGateway(apply)}
        <div style={{ padding: 10, display: 'flex', alignItems: 'flex-end' }}>
          <Input.TextArea
            style={{ height: 100 }}
            placeholder="请填写备注信息"
            defaultValue={content}
            onChange={(e) => {
              info.content = e.target.value;
            }}
          />
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
