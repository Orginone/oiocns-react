import { Modal } from 'antd';
import React from 'react';

const ChooseCreateWayModal: React.FC = () => {
  return (
    <Modal
      title="创建应用"
      width={670}
      destroyOnClose={true}
      open={true}
      bodyStyle={{ padding: 0 }}></Modal>
  );
};
export default ChooseCreateWayModal;
