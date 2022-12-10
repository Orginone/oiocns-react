import React from 'react';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { Modal } from 'antd';

/**
 * @description: 邀请成员
 * @return {*}
 */

interface Iporps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  title: string;
  setSelectPerson: any;
}

const InviteMembers: React.FC<Iporps> = ({
  open,
  onOk,
  onCancel,
  title,
  setSelectPerson,
}) => {
  return (
    <Modal
      title={title}
      destroyOnClose
      open={open}
      width={1024}
      onCancel={onCancel}
      onOk={onOk}>
      <AssignPosts searchFn={setSelectPerson} />
    </Modal>
  );
};
export default InviteMembers;
