import React from 'react';
import { Modal } from 'antd';
import QrCode from 'qrcode.react';
import { IEntity } from '@/ts/core';
import { schema } from '@/ts/base';

interface IProps {
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

const EntityQrCode: React.FC<IProps> = ({ entity, finished }) => {
  return (
    <Modal
      open
      closable={false}
      onOk={finished}
      destroyOnClose
      maskClosable
      onCancel={finished}
      title={`分享二维码[${entity.typeName}]`}
      cancelButtonProps={{ disabled: true }}>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <QrCode
          level="H"
          size={300}
          fgColor={'#204040'}
          value={`${location.origin}/${entity.id}`}
          imageSettings={{
            src: entity.share.avatar?.thumbnail ?? '',
            width: 80,
            height: 80,
            excavate: true,
          }}
        />
        <div
          style={{
            fontSize: 22,
            marginTop: 10,
          }}>
          {entity.name}
        </div>
      </div>
    </Modal>
  );
};

export default EntityQrCode;
