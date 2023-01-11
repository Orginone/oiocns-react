import { Modal } from 'antd';
import React from 'react';
interface Iprops {
  open: boolean;
}
const ChooseCreateWayModal: React.FC<Iprops> = ({ open }: Iprops) => {
  return (
    <Modal
      title="创建应用"
      width={670}
      destroyOnClose={true}
      open={open}
      bodyStyle={{ padding: 0 }}>
      创建应用
    </Modal>
  );
};
export default ChooseCreateWayModal;
