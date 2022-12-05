import React, { useState } from 'react';
import { Drawer, Table } from 'antd';
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
  const scale = useAppwfConfig((state: any) => state.scale);
  const close = () => {
    setShowConfig(false);
  };
  const Selected = (node: any) => {
    console.log('点击的node', node);
    setShowConfig(true);
    setSelectedNode(node);
  };

  // 抽屉
  const configDrawer = <FlowDrawer open={showConfig} onClose={close} />;
  return (
    <div>
      <div className={cls['design']} style={{ transform: `scale(${scale / 100})` }}>
        <ProcessTree OnSelectedNode={Selected} />
      </div>
      {configDrawer}
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
