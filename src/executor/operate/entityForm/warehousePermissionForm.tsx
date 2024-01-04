import { IDirectory } from '@/ts/core';
import { Modal, Button, Spin, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { IRepository } from '@/ts/core/thing/standard/repository';
import SelectIdentity from '@/components/Common/SelectIdentity';
import ShareShowComp from '@/components/Common/ShareShowComp';
import {
  convertNode,
  loadNilResouce,
  loadResource,
  loadcode,
} from '@/components/Common/FlowDesign/processType';
import useAsyncLoad from '@/hooks/useAsyncLoad';
interface Iprops {
  current: IRepository;
  finished: () => void;
}

const WarehousePermission = (props: Iprops) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState<any>();
  const [loaded, resource] = useAsyncLoad(async () => {
    const node = await props.current.works[0].loadNode();
    if (node && node.code) {
      return loadResource(node, '');
    }
    return loadcode();
  });
  useEffect(() => {
    (async () => {
      const workNode = await props.current.works[0].loadNode();
      if (workNode && workNode.code) {
        setCurrentData({
          id: workNode.children?.destId,
          name: workNode.children?.destName,
        });
      }
    })();
    return () => {
      setCurrentData(null);
    };
  }, []);
  return (
    <>
      <Modal
        width={600}
        title="设立仓库管理者"
        open={true}
        destroyOnClose={true}
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
        onOk={async () => {
          if (!currentData) {
            message.warning('请先设置管理员');
            return;
          }
          const a = resource;
          a.children.destId = currentData.id;
          a.children.destName = currentData.name;
          a.children.destType = currentData.typeName;
          console.log(resource);
          if (
            await props.current.works[0].update({
              ...props.current.works[0].metadata,
              resource: a,
            })
          ) {
            props.current.loadWorks(true);
            console.log(props.current.works[0].metadata, a);
            message.info('保存成功');
            props.finished();
          }
        }}
        onCancel={() => props.finished()}>
        {loaded ? (
          <>
            <Button
              onClick={() => {
                setIsOpen(true);
              }}>
              选择角色
            </Button>
            {currentData && currentData.id != '1' && (
              <ShareShowComp
                departData={[currentData]}
                deleteFuc={(_) => {
                  // props.current.destId = '';
                  // props.current.destName = '';
                  setCurrentData(undefined);
                  // props.refresh();
                }}
              />
            )}
          </>
        ) : (
          <Spin tip={'配置信息加载中...'}>
            <div style={{ width: '100%', height: '100%' }}></div>
          </Spin>
        )}
      </Modal>
      <SelectIdentity
        open={isOpen}
        exclude={[]}
        multiple={false}
        space={props.current.directory.target.space}
        finished={(selected) => {
          console.log(selected);
          setCurrentData(selected[0]);
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default WarehousePermission;
