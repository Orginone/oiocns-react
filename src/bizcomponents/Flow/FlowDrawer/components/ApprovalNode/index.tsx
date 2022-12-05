import React, { useState } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Button, Divider, Col, Radio, Space, Form, InputNumber } from 'antd';
import type { RadioChangeEvent } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
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
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [selectPost, setSelectPost] = useState();
  const [radioValue, setRadioValue] = useState(1);
  const [processValue, setProcessValue] = useState(1);

  const onOk = (params: any) => {
    selectedNode.props.assignedUser = [{ name: params.node.name, id: params.node.id }];
    setSelectedNode(selectedNode);
    setSelectPost(params);
  };
  const onCancel = () => {
    setIsOpen(false);
  };

  // 查询个人加入的群组
  // const getJoinedCohort = async () => {
  //   const JoinedCohortList = await personObj;
  //   console.log('444', JoinedCohortList);
  // };

  // 选择审批对象
  const rovalnode = (
    <div className={cls[`roval-node`]}>
      <Row>
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
            setIsOpen(true);
            // getJoinedCohort();
          }}>
          选择岗位
        </Button>
        {selectPost ? (
          <span>
            当前选择：<a>{selectPost?.node.name}</a>
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
                selectedNode.props.num = String(e);
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
  );
  return (
    <div className={cls[`app-roval-node`]}>
      {rovalnode}
      <PersonCustomModal
        open={isOpen}
        title={'选择岗位'}
        onOk={onOk}
        onCancel={onCancel}
      />
    </div>
  );
};
export default ApprovalNode;
