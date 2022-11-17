import React, { useState } from 'react';
import { Row, Button } from 'antd';
import PersonCustomModal from '../PersonCustomModal';
import cls from './index.module.less';

/**
 * @description: 抄送对象
 * @return {*}
 */

const CcNode = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOk = () => {
    setIsOpen(false);
  };
  const onCancel = () => {
    setIsOpen(false);
  };
  // 选择抄送对象
  const rovalnode = (
    <div className={cls[`roval-node`]}>
      <Row>
        <Button
          type="primary"
          shape="round"
          size="small"
          onClick={() => {
            setIsOpen(true);
          }}>
          选择抄送对象
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
export default CcNode;
