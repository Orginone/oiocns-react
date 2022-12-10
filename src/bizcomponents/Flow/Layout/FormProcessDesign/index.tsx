import React, { useState } from 'react';
import { Drawer, message, Table } from 'antd';
import ProcessTree from '@/bizcomponents/Flow/Process/ProcessTree';
import cls from './index.module.less';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';
import FlowDrawer from '@/bizcomponents/Flow/FlowDrawer';
type FormProcessDesignProps = {
  [key: string]: any;
};

/**
 * 空节点
 * @returns
 */
const FormProcessDesign: React.FC<FormProcessDesignProps> = () => {
  const { Column } = Table;
  const [showConfig, setShowConfig] = useState(false);
  const [dialogTableVisible, setDialogTableVisible] = useState(false);
  const [flowRecords, setFlowRecords] = useState([]);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const scale = useAppwfConfig((state: any) => state.scale);

  const closeItem = () => {
    /** 判断是否全部填写 */
    const isAllFill = (selectedNode.conditions || []).some((item) => {
      return !item.paramLabel || !item.label || !item.val;
    });

    if (isAllFill) {
      message.warning('请补充未填写的字段');
    } else {
      setShowConfig(false);
      setSelectedNode([]);
    }
  };
  const Selected = (node: any) => {
    setShowConfig(true);
    setSelectedNode(node);
  };
  return (
    <div>
      <div className={cls['design']} style={{ transform: `scale(${scale / 100})` }}>
        <ProcessTree OnSelectedNode={Selected} />
      </div>
      <FlowDrawer open={showConfig} onClose={() => closeItem()} />
      <Drawer
        open={dialogTableVisible}
        title="详情"
        getContainer={false}
        destroyOnClose={true}>
        <Table dataSource={flowRecords}>
          <Column dataIndex="target" key="target" title="审批人" />
          <Column dataIndex="createTime" key="createTime" title="时间" />
          <Column dataIndex="comment" key="comment" title="审批意见" />
        </Table>
      </Drawer>
    </div>
  );
};

export default FormProcessDesign;
