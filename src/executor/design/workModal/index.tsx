import React from 'react';
import { IWork } from '@/ts/core';
import { Spin } from 'antd';
import FlowDesign from '@/components/Common/FlowDesign';
import FullScreenModal from '@/components/Common/fullScreen';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import {
  AddNodeType,
  ValidationInfo,
  convertNode,
  getNodeCode,
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
    if (current) {
      const node = await current.loadWorkNode();
      if (node && node.code) {
        return loadResource(node, '');
      }
    }
    return {
      code: getNodeCode(),
      parentCode: '',
      type: AddNodeType.ROOT,
      name: '发起权限',
      destType: '角色',
      destId: '0',
      destName: '全员',
      num: 1,
      children: {},
    };
  });
  const Save = async () => {
    const validation: ValidationInfo = {
      isPass: true,
      allowFillWork: false,
    };
    //数据结构转化
    const resource_ = convertNode(resource, validation);
    if (validation.isPass) {
      current.metadata.rule = JSON.stringify({
        allowAdd: current.metadata.allowAdd,
        allowEdit: current.metadata.allowEdit,
        allowSelect: current.metadata.allowSelect,
        allowFillWork: validation.allowFillWork,
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
