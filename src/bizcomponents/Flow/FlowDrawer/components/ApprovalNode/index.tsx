import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Row, Button } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
import cls from './index.module.less';

/* 
    审批对象
*/

const ApprovalNode = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOk = () => {
    setIsOpen(false);
  };
  const onCancel = () => {
    setIsOpen(false);
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
          onClick={() => {
            setIsOpen(true);
          }}>
          选择身份
        </Button>
      </Row>
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
