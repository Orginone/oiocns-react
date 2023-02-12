import { Card, message, Modal } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';
interface Iprops {
  open: boolean;
  setCreateWay: Function;
}
const AppInfoModal: React.FC<Iprops> = ({ open, setCreateWay }: Iprops) => {
  return (
    <Modal
      title="编辑应用信息"
      width={670}
      destroyOnClose={true}
      onCancel={() => setCreateWay(undefined)}
      footer={[]}
      open={open}
      bodyStyle={{ padding: 0, border: 0 }}>
      编辑应用信息
    </Modal>
  );
};
export default AppInfoModal;
