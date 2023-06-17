import React, { useState } from 'react';
import { Divider, Modal, ModalProps, Space, Typography } from 'antd';
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  SaveOutlined,
} from '@ant-design/icons';

interface IFullModalProps extends ModalProps {
  fullScreen?: boolean;
  onSave?: () => void;
  icon?: React.ReactNode;
}

const FullScreenModal: React.FC<IFullModalProps> = (props) => {
  const [modalState, setModalState] = useState(!props.fullScreen);
  const loadModalProps = () => {
    if (modalState) return { ...props };
    return {
      ...props,
      width: '100vw',
      style: {
        ...props.style,
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      },
      bodyStyle: {
        ...props.bodyStyle,
        height: 'calc(100vh - 112px)',
        maxHeight: '100vh',
      },
    };
  };
  const readerTitle = () => {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Space wrap split={<Divider type="vertical" />} size={2}>
          {props.icon}
          {props.title}
        </Space>
        <Space wrap split={<Divider type="vertical" />} size={2}>
          {props.onSave && (
            <Typography.Link
              key={'max'}
              title={'保存'}
              style={{ fontSize: 18 }}
              onClick={() => {
                props.onSave?.apply(this, []);
              }}>
              <SaveOutlined />
            </Typography.Link>
          )}
          <Typography.Link
            key={'max'}
            title={modalState ? '最大化' : '恢复'}
            style={{ fontSize: 18 }}
            onClick={() => {
              setModalState(!modalState);
            }}>
            {modalState ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
          </Typography.Link>
          <Typography.Link
            key={'close'}
            title={'关闭'}
            style={{ fontSize: 18 }}
            onClick={(e) => {
              props.onCancel?.apply(this, [e]);
            }}>
            <CloseOutlined />
          </Typography.Link>
        </Space>
      </div>
    );
  };
  return (
    <Modal
      {...loadModalProps()}
      title={readerTitle()}
      closable={false}
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    />
  );
};

export default FullScreenModal;
