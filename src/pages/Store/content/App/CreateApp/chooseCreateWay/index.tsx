import { Card, message, Modal } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';
interface Iprops {
  open: boolean;
  setOpen: Function;
  jump: Function;
}
const ChooseCreateWayModal: React.FC<Iprops> = ({ open, setOpen, jump }: Iprops) => {
  const createBlankApp = () => {
    setOpen(false);
    jump('/store/app/createBlankApp');
  };
  const createAppByTemplate = () => {
    setOpen(false);
    // jump('/store/app/createAppByTemplate');
    message.warn('该功能尚未开放');
  };
  const createAppByCustom = () => {
    setOpen(false);
    message.warn('该功能尚未开放');
    // jump('/store/app/create');
  };
  return (
    <Modal
      title="创建应用"
      width={670}
      destroyOnClose={true}
      onCancel={() => setOpen(false)}
      footer={[]}
      open={open}
      bodyStyle={{ padding: 0, border: 0 }}>
      <div style={{ display: 'flex' }}>
        <Card
          hoverable
          style={{ width: 250, marginRight: '20px' }}
          onClick={createBlankApp}
          cover={
            <img
              style={{ width: 190, height: 150 }}
              alt="example"
              src="public/img/createApp/createBlankApp.png"
            />
          }>
          <div style={{}}>创建空白应用</div>
        </Card>
        <Card
          hoverable
          style={{ width: 250, marginRight: '20px' }}
          onClick={createAppByTemplate}
          cover={
            <img
              style={{ width: 190, height: 150 }}
              alt="example"
              src="public/img/createApp/createAppByTemplate.png"
            />
          }>
          <div style={{}}>模板中心创建</div>
        </Card>
        <Card
          hoverable
          style={{ width: 250 }}
          onClick={createAppByCustom}
          cover={
            <img
              style={{ width: 190, height: 150 }}
              alt="example"
              src="public/img/createApp/createAppByCustom.png"
            />
          }>
          <div style={{}}>定制应用</div>
        </Card>
      </div>
    </Modal>
  );
};
export default ChooseCreateWayModal;
