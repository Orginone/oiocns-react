import React from 'react';
import AssignPosts from '@/bizcomponents/Indentity/components/AssignPosts';
import { Modal } from 'antd';

/**
 * @description: 移出成员
 * @return {*}
 */

interface Iporps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  title: string;
  setSelectPerson?: any;
  personData?: any;
}

const RemoveMember: React.FC<Iporps> = ({
  open,
  onOk,
  onCancel,
  title,
  setSelectPerson,
  personData,
}) => {
  return (
    <Modal
      title={title}
      destroyOnClose
      open={open}
      width={1024}
      onCancel={onCancel}
      onOk={onOk}>
      <AssignPosts searchFn={setSelectPerson} personData={personData} />
    </Modal>
  );
};
export default RemoveMember;
