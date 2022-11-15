import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Row, Button, Divider, Select, Col, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
import cls from './index.module.less';

/* 
    审批对象
*/

const { Option } = Select;

const ApprovalNode = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // 打开弹窗
  const [value, setValue] = useState(1);
  const onOk = () => {
    setIsOpen(false);
  };
  const onCancel = () => {
    setIsOpen(false);
  };
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  // 选择审批对象
  const rovalnode = (
    <div className={cls[`roval-node`]}>
      <Row>
        <SettingOutlined />
        <span className={cls[`roval-node-title`]}>选择审批对象</span>
      </Row>
      <Row>
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setIsOpen(true);
          }}>
          选择岗位
        </Button>
      </Row>
      <Divider />
      <div className={cls['roval-node-select']}>
        <Col className={cls['roval-node-select-col']}>👩‍👦‍👦 多人审批时审批方式</Col>
        <Select
          defaultValue={1}
          // onChange={handleChange}
          style={{ width: 400 }}>
          <Option value={1}>会签（可同时审批，每个人必须同意）</Option>
          <Option value={2}>或签（有一人同意即可）</Option>
        </Select>
      </div>
      <div className={cls['roval-node-radiobtns']}>
        <Col className={cls['roval-node-select-col']}>🙅‍ 如果审批被驳回 👇</Col>
        <Row>
          <Radio.Group onChange={onChange} value={value}>
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
