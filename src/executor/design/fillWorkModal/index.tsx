import React, { useState } from 'react';
import { IWork } from '@/ts/core';
import { Button, Card, Spin, message } from 'antd';
import FullScreenModal from '@/components/Common/fullScreen';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { model } from '@/ts/base';
import OpenFileDialog from '@/components/OpenFileDialog';

type IProps = {
  current: IWork;
  finished: () => void;
};

/*
  补充成员办事
*/
const FillWorkModal: React.FC<IProps> = ({ current, finished }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectNode, setSelectNode] = useState<model.WorkNodeModel>();
  const [loaded, memberNodeInfo] = useAsyncLoad(async () => {
    await current.loadContent();
    return await current.loadMemberNodeInfo(true);
  });

  const loadContent = () => {
    if (!loaded) {
      return (
        <Spin tip={'配置信息加载中...'}>
          <div style={{ width: '100%', height: '100%' }}></div>
        </Spin>
      );
    }
    const loadCard = (node: model.WorkNodeModel) => {
      const info = memberNodeInfo!.find((a) => a.memberNodeId == node.id);

      return (
        <Card
          type="inner"
          title={`${node.name}[${node.destName}]     ${
            info ? info.memberDefine.name : '暂未绑定!'
          }`}
          extra={
            <Button
              onClick={() => {
                setSelectNode(node);
                setIsOpen(true);
              }}>
              {info ? '重绑办事' : '绑定办事'}
            </Button>
          }
        />
      );
    };
    return current.memberNodes?.map((a) => {
      return loadCard(a as model.WorkNodeModel);
    });
  };

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
      {loadContent()}
      {isOpen && selectNode && (
        <OpenFileDialog
          title={'选中办事'}
          rootKey={'disk'}
          accepts={['办事']}
          allowInherited
          excludeIds={[]}
          onCancel={() => setIsOpen(false)}
          onOk={async (works) => {
            if (works.length > 0) {
              const work = works[0] as IWork;
              const ret = await current.bingdingMember(selectNode!.id, work.metadata);
              if (ret) {
                memberNodeInfo?.push(ret);
                message.info('绑定成功!');
                setIsOpen(false);
              }
            } else {
              setIsOpen(false);
            }
          }}
        />
      )}
    </FullScreenModal>
  );
};

export default FillWorkModal;
