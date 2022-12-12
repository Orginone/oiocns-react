import React, { useState } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Button, Divider, Col, Radio, Space, Form, InputNumber, Modal } from 'antd';
// import PersonCustomModal from '../PersonCustomModal';
import IndentityManage from '@/bizcomponents/IndentityManage';
import cls from './index.module.less';
import { useAppwfConfig } from '@/bizcomponents/Flow/flow';

/**
 * @description: 审批对象
 * @return {*}
 */

const ApprovalNode = () => {
  // const personObj = userCtrl.User.getJoinedCohorts();
  const selectedNode = useAppwfConfig((state: any) => state.selectedNode);
  const setSelectedNode = useAppwfConfig((state: any) => state.setSelectedNode);

  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false); // 打开弹窗
  const [radioValue, setRadioValue] = useState(1);
  const [processValue, setProcessValue] = useState(1);
  const [currentData, setCurrentData] = useState<{
    data: { id: string; name: string };
    title: string;
    key: string;
  }>({ title: '', key: '', data: { id: '', name: '' } });

  const onOk = () => {
    selectedNode.props.assignedUser = [
      { name: currentData.data.name, id: currentData.data.id },
    ];
    setSelectedNode(selectedNode);
    setIsApprovalOpen(false);
  };

  const onCancel = () => {
    setIsApprovalOpen(false);
  };

  return (
    <div className={cls[`app-roval-node`]}>
      <div className={cls[`roval-node`]}>
        <Row style={{ marginBottom: '10px' }}>
          <SettingOutlined style={{ marginTop: '3px' }} />
          <span className={cls[`roval-node-title`]}>选择审批对象</span>
        </Row>
        <Space>
          <Button
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              selectedNode.props.assignedType = 'JOB';
              setSelectedNode(selectedNode);
              setIsApprovalOpen(true);
              // getJoinedCohort();
            }}>
            选择身份
          </Button>
          {currentData?.title ? (
            <span>
              当前选择：<a>{currentData?.title}</a>
            </span>
          ) : null}
        </Space>
        <Divider />
        <div className={cls['roval-node-select']}>
          <Col className={cls['roval-node-select-col']}>👩‍👦‍👦 多人审批时审批方式</Col>
          <Radio.Group
            onChange={(e) => {
              setRadioValue(e.target.value);
            }}
            style={{ paddingBottom: '10px' }}
            value={radioValue}>
            <Radio value={1}>全部（所有人必须同意）</Radio>
            <Radio value={2}>会签（可同时审批，每个人必须同意）</Radio>
          </Radio.Group>
          {radioValue === 2 ? (
            <Form.Item label="会签人数">
              <InputNumber
                onChange={(e) => {
                  selectedNode.props.num = e;
                }}
                placeholder="请设置会签人数"
                addonBefore={<UserOutlined />}
                style={{ width: '60%' }}
              />
            </Form.Item>
          ) : null}
        </div>
        <div className={cls['roval-node-radiobtns']}>
          <Col className={cls['roval-node-select-col']}>🙅‍ 如果审批被驳回 👇</Col>
          <Row>
            <Radio.Group
              onChange={() => {
                setProcessValue(1);
              }}
              value={processValue}>
              <Radio value={1}>直接结束流程</Radio>
              <Radio value={2} disabled>
                驳回到上级审批节点
              </Radio>
              <Radio value={3} disabled>
                驳回到指定节点
              </Radio>
            </Radio.Group>
          </Row>
        </div>
      </div>
      <Modal
        title="添加身份"
        key="addApproval"
        open={isApprovalOpen}
        destroyOnClose={true}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        width="650px">
        <IndentityManage
          multiple={false}
          onChecked={(params: any) => {
            selectedNode.props.assignedUser = [
              { name: params.data.name, id: params.data.id },
            ];
            setSelectedNode(selectedNode);
            setCurrentData(params);
          }}
        />
      </Modal>
    </div>
  );
};
export default ApprovalNode;
