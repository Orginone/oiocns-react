import React from 'react';
import { IForm } from '@/ts/core';
import SelectPropertys from './SelectPropertys';
import { Modal } from 'antd';
import { AttributeModel } from '@/ts/base/model';

interface IProps {
  current: IForm;
  isOpen: boolean;
  setIsOpen: (ble: boolean) => void;
  updateSchema: () => void;
}

/**
 * @description: 新增、编辑特性
 * @return {*}
 */
const AttrModal = ({ current, isOpen, setIsOpen, updateSchema }: IProps) => {
  const onFinished = () => {
    updateSchema();
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      width={800}
      title="选择属性"
      destroyOnClose
      okText="确定"
      onOk={onFinished}
      onCancel={onFinished}>
      <SelectPropertys
        target={current.directory.target}
        selected={current.attributes.map((a) => a.property!)}
        onAdded={async (prop) => {
          await current.createAttribute(
            {
              name: prop.name,
              code: prop.code,
              rule: '{}',
              remark: prop.remark,
            } as AttributeModel,
            prop,
          );
          await current.loadFields(true);
        }}
        onDeleted={async (id) => {
          const attr = current.attributes.find((i) => i.propId === id);
          if (attr) {
            await current.deleteAttribute(attr);
            await current.loadFields(true);
          }
        }}
      />
    </Modal>
  );
};
export default AttrModal;
