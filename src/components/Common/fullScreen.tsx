import React, { useState } from 'react';
import { Divider, Modal, ModalProps, Space, Typography } from 'antd';
import {
  AiOutlineClose,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSave,
} from 'react-icons/ai';

interface IFullModalProps extends ModalProps {
  hideMaxed?: boolean;
  fullScreen?: boolean;
  onSave?: () => void;
  icon?: React.ReactNode;
  bodyHeight?: number | string;
}

const FullScreenModal: React.FC<IFullModalProps> = (props) => {
  const [modalState, setModalState] = useState(!props.fullScreen);
  const loadModalProps = () => {
    if (modalState)
      return {
        ...props,
        bodyStyle: {
          ...props.bodyStyle,
          height: props.bodyHeight,
          padding: 6,
          margin: 2,
          maxHeight: 'calc(100vh - 80px)',
        },
      };
    return {
      ...props,
      width: '100vw',
      style: {
        ...props.style,
        height: 'calc(100vh - 2px)',
        maxWidth: 'calc(100vw - 2px)',
        top: 1,
      },
      bodyStyle: {
        ...props.bodyStyle,
        padding: 6,
        margin: 2,
        height: 'calc(100vh - 80px)',
        maxHeight: 'calc(100vh - 80px)',
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
              title={'保存'}
              style={{ fontSize: 18 }}
              onClick={() => {
                props.onSave?.apply(this, []);
              }}>
              <AiOutlineSave size={20} />
            </Typography.Link>
          )}
          {!props.hideMaxed && (
            <Typography.Link
              title={modalState ? '最大化' : '恢复'}
              style={{ fontSize: 18 }}
              onClick={() => {
                setModalState(!modalState);
              }}>
              {modalState ? (
                <AiOutlineFullscreen size={20} />
              ) : (
                <AiOutlineFullscreenExit size={20} />
              )}
            </Typography.Link>
          )}
          <Typography.Link
            title={'关闭'}
            style={{ fontSize: 18 }}
            onClick={(e) => {
              props.onCancel?.apply(this, [e]);
            }}>
            <AiOutlineClose size={20} />
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
