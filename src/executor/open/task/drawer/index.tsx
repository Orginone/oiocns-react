import React from 'react';
import { Drawer, Typography } from 'antd';
import { NodeModel } from '@/components/Common/FlowDesign/processType';
import { schema } from '@/ts/base';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
/**
 * @description: 流程设置抽屉
 * @return {*}
 */

interface IProps {
  instance: schema.XWorkInstance;
  isOpen: boolean;
  current: NodeModel;
  onClose: () => void;
}

const FlowDrawer: React.FC<IProps> = (props) => {
  const Component = () => {
    return props.instance.tasks
      ?.find((a) => a.nodeId == props.current.id)
      ?.records?.map((record: any) => {
        let handleResult = '通过';
        if (record.status >= 200) {
          handleResult = '不通过';
        }
        return (
          <>
            <div>
              审核人：
              <EntityIcon entityId={record.createUser} showName />
            </div>
            <div>审核结果：{handleResult}</div>
            <div>审核意见：{record.comment}</div>
            <div>审核时间：{record.createTime}</div>
          </>
        );
      });
  };

  return (
    <Drawer
      title={
        <div>
          <Typography.Title editable={false} level={5} style={{ margin: 0 }}>
            {props.current.name}
          </Typography.Title>
        </div>
      }
      open={props.isOpen}
      destroyOnClose
      placement="right"
      onClose={() => props.onClose()}
      width={500}>
      {Component()}
    </Drawer>
  );
};

export default FlowDrawer;
