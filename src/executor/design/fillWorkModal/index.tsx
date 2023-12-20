import React, { useEffect, useState } from 'react';
import { IWork } from '@/ts/core';
import { Button, Card, Spin, message } from 'antd';
import FullScreenModal from '@/components/Common/fullScreen';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { model, schema } from '@/ts/base';
import OpenFileDialog from '@/components/OpenFileDialog';
import { TextBox } from 'devextreme-react';
import SelectIdentity from '@/components/Common/SelectIdentity';

type IProps = {
  current: IWork;
  finished: () => void;
};

type IGprops = {
  current: IWork;
  node: model.WorkNodeModel;
};
const GatewayInfo: React.FC<IGprops> = ({ current, node }) => {
  const [openType, setOpenType] = useState<string>();
  const [identity, setIdentity] = useState<schema.XIdentity>();
  const [define, setDefine] = useState<schema.XWorkDefine>();
  useEffect(() => {
    const gateway = current.gatewayInfo!.find((a) => a.nodeId == node.id);
    setIdentity(gateway?.identity);
    setDefine(gateway?.define);
  }, []);
  useEffect(() => {
    if (identity && define) {
      current.bingdingGateway(node.id, identity, define).then((success) => {
        if (success) {
          message.info('绑定成功!');
        }
      });
    }
  }, [identity, define]);
  return (
    <Card
      key={node.id}
      type="inner"
      title={`节点:${node.name} `}
      extra={
        <>
          <TextBox
            readOnly
            value={define?.name}
            placeholder="请绑定办事"
            style={{ display: 'inline-block' }}
          />
          <Button
            style={{ display: 'inline-block', marginRight: 10 }}
            onClick={() => {
              setOpenType('define');
            }}>
            {define ? '重绑办事' : '绑定办事'}
          </Button>
          <TextBox
            readOnly
            value={identity?.name}
            placeholder="请绑定通知目标角色"
            style={{ display: 'inline-block' }}
          />
          <Button
            style={{ display: 'inline-block', marginRight: 10 }}
            onClick={() => {
              setOpenType('identity');
            }}>
            {identity ? '重绑角色' : '绑定角色'}
          </Button>
        </>
      }>
      {openType == 'define' && (
        <OpenFileDialog
          title={'选中办事'}
          rootKey={'disk'}
          accepts={['办事']}
          allowInherited
          excludeIds={[current.id]}
          onCancel={() => setOpenType(undefined)}
          onOk={async (works) => {
            if (works.length > 0) {
              setDefine(works[0].metadata as schema.XWorkDefine);
            }
            setOpenType(undefined);
          }}
        />
      )}
      <SelectIdentity
        open={openType == 'identity'}
        exclude={[]}
        multiple={false}
        space={current.directory.target.space}
        finished={(selected) => {
          if (selected.length > 0) {
            setIdentity(selected[0]);
          }
          setOpenType(undefined);
        }}
      />
    </Card>
  );
};

/*
  补充成员办事
*/
const FillWorkModal: React.FC<IProps> = ({ current, finished }) => {
  const [loaded] = useAsyncLoad(async () => {
    await current.loadContent();
  });
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
      destroyOnClose
      width="60vw"
      okText="发布"
      cancelText="取消"
      title={`事项[${current.name}]设计`}
      onCancel={() => finished()}>
      {current.gatewayNodes?.map((a) => {
        return <GatewayInfo key={a.id} current={current} node={a} />;
      })}
    </FullScreenModal>
  );
};

export default FillWorkModal;
