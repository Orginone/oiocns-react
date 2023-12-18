import React from 'react';
import { IWork } from '@/ts/core';
import { Spin } from 'antd';
import FlowDesign from '@/components/Common/FlowDesign';
import FullScreenModal from '@/components/Common/fullScreen';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import {
  ValidationInfo,
  convertNode,
  loadNilResouce,
  loadResource,
} from '@/components/Common/FlowDesign/processType';
import message from '@/utils/message';

type IProps = {
  current: IWork;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const ApplicationModal: React.FC<IProps> = ({ current, finished }) => {
  const [loaded, resource] = useAsyncLoad(async () => {
    const node = await current.loadNode();
    if (node && node.code) {
      return loadResource(node, '');
    }
    return loadNilResouce();
  });
  const Save = async () => {
    const validation: ValidationInfo = {
      isPass: true,
      hasGateway: false,
    };
    //数据结构转化
    const resource_ = convertNode(resource, validation);
    if (validation.isPass) {
      current.metadata.rule = JSON.stringify({
        hasGateway: validation.hasGateway,
      });
      if (
        await current.update({
          ...current.metadata,
          resource: resource_,
        })
      ) {
        message.info('保存成功');
        finished();
      }
    }
  };

  if (!loaded) {
    return (
      <Spin tip={'配置信息加载中...'}>
        <div style={{ width: '100%', height: '100%' }}></div>
      </Spin>
    );
  }
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      destroyOnClose
      footer={[]}
      width="80vw"
      okText="发布"
      cancelText="取消"
      title={`事项[${current.name}]设计`}
      onSave={Save}
      onCancel={() => finished()}>
      <FlowDesign current={current} resource={resource} />
    </FullScreenModal>
  );
};

export default ApplicationModal;
