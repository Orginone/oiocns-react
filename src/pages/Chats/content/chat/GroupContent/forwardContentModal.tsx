import React, { FC } from 'react';
import { Modal } from 'antd';

import { IMessage } from '@/ts/core';
interface IForwardContentModalProps {
  open: boolean;
  messages: IMessage[];
  title: string;
  isBelongPerson?: boolean;
  handleClose: () => void;
  viewForward?: (item: IMessage[]) => void;
  children?: React.ReactNode
}

const ForwardContentModal: FC<IForwardContentModalProps> = (props) => {
  const { open, title, handleClose } = props;

  return (
    <Modal
      title={title}
      open={open}
      footer={null}
      closable={false}
      onCancel={handleClose}>
        {props.children}
    </Modal>
  );
};

export default ForwardContentModal;
