import React, { Component, useState } from 'react';
import { Drawer, Table, Input } from 'antd';
import ProcessTree from '@/bizcomponents/Flow/Process/ProcessTree';
import { EditOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import { useAppwfConfig } from '@/module/flow/flow';
import FlowDrawer from '@/bizcomponents/Flow/FlowDrawer';
import { title } from 'process';
type FormProcessDesignProps = {
  [key: string]: any;
};

/**
 * 空节点
 * @returns
 */
const FormProcessDesign: React.FC<FormProcessDesignProps> = () => {
  const { Column } = Table;
  const [showConfig, setShowConfig] = useState(false); // 打开关闭抽屉
  const [showInput, setShowInput] = useState(false);
  const [dialogTableVisible, setDialogTableVisible] = useState(false);
  const [flowRecords, setFlowRecords] = useState([]);
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);
  const close = () => {
    setShowConfig(false);
  };
  const Selected = (node: any) => {
    setShowConfig(true);
    setSelectedNode(node);
  };

  // 抽屉
  const configDrawer = <FlowDrawer open={showConfig} onClose={close} />;
  return (
    <div>
      <div className={cls['design']}>
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
    // <Drawer  v-model="showConfig" :modal-append-to-body="false"  :size="selectedNode?.type === 'CONDITION' ? '600px':'500px'" direction="rtl" destroy-on-close>
    //   <template #header="{  titleId, titleClass }">
    //     <el-input v-model="selectedNode.name" size="default" v-show="showInput" style="width: 300px"
    //       @blur="showInput = false" @keyup.enter.native="showInput = false"></el-input>
    //   <el-link :id="titleId" :class="titleClass" v-show="!showInput" @click="showInput = true">
    //     {{selectedNode.name}}<el-icon class="el-icon--right"><Edit /></el-icon>
    //   </el-link>
    // </template>
    //   <div class="node-config-content">
    //     <NodeConfig />
    //   </div>
    // </Drawer>

    // <Drawer
    //   v-model="dialogTableVisible"
    //   title="详情"
    //   direction="rtl"
    //   size="50%"
    // >
    //   <Table  :data="_flowRecords">
    //     <Column  property="target" label="审批人"  />
    //     <Column  property="createTime" label="时间"  />
    //     <Column  property="comment" label="审批意见" />
    //   </Table >
    // </Drawer>
  );
};

export default FormProcessDesign;
