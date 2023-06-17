import { IDirectory, IEntity, IFileInfo, IMemeber, IMsgChat } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { command, schema } from '@/ts/base';
import { Modal, Upload } from 'antd';
import QrCode from 'qrcode.react';
import React from 'react';
/** 执行非页面命令 */
export const executeCmd = (cmd: string, entity: any, args: any[]) => {
  switch (cmd) {
    case 'qrcode':
      return entityQrCode(entity);
    case 'refresh':
      return directoryRefresh(entity);
    case 'openChat':
      return openChat(entity);
    case 'delete':
      return deleteEntity(entity);
    case 'remove':
      return removeMember(entity);
    case 'newFile':
      return uploadFile(entity, (file) => {
        if (file) {
          orgCtrl.changCallback();
        }
      });
  }
  return false;
};

/** 刷新目录 */
const directoryRefresh = (dir: IDirectory) => {
  dir.loadContent(true).then(() => {
    orgCtrl.changCallback();
  });
};

/** 打开会话 */
const openChat = (chat: IDirectory | IMemeber | IMsgChat) => {
  if ('taskList' in chat) {
    orgCtrl.currentKey = chat.target.chatdata.fullId;
  } else if ('fullId' in chat) {
    orgCtrl.currentKey = chat.fullId;
  } else {
    orgCtrl.currentKey = chat.chatdata.fullId;
  }
  command.emitter('_', 'link', '/chat');
};

/** 删除实体 */
const deleteEntity = (entity: IFileInfo<schema.XEntity>) => {
  Modal.confirm({
    okText: '确认',
    cancelText: '取消',
    title: '删除询问框',
    content: (
      <div style={{ fontSize: 16 }}>
        确认要删除{entity.typeName}[{entity.name}]吗?
      </div>
    ),
    onOk: () => {
      entity.delete().then((success: boolean) => {
        if (success) {
          orgCtrl.changCallback();
        }
      });
    },
  });
};

/** 移除成员 */
const removeMember = (member: IMemeber) => {
  Modal.confirm({
    icon: <></>,
    title: `确认要移除成员[${member.name}]吗?`,
    onOk: () => {
      member.directory.target
        .removeMembers([member.metadata])
        .then((success: boolean) => {
          if (success) {
            orgCtrl.changCallback();
          }
        });
    },
  });
};

/** 实体二维码 */
const entityQrCode = (entity: IEntity<schema.XEntity>) => {
  Modal.info({
    icon: <></>,
    okText: '关闭',
    maskClosable: true,
    content: (
      <div style={{ textAlign: 'center' }}>
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
    ),
  });
};

/** 文件上传 */
export const uploadFile = (
  dir: IDirectory,
  uploaded?: (file: IFileInfo<schema.XEntity> | undefined) => void,
) => {
  const modal = Modal.info({
    icon: <></>,
    okText: '关闭',
    width: 610,
    title: '文件上传',
    maskClosable: true,
    content: (
      <Upload
        type={'drag'}
        showUploadList={false}
        style={{ width: 550, height: 300 }}
        customRequest={async (options) => {
          modal.destroy();
          const file = options.file as File;
          if (file) {
            uploaded?.apply(this, [await dir.createFile(file)]);
          }
        }}>
        <div style={{ color: 'limegreen', fontSize: 22 }}>点击或拖拽至此处上传</div>
      </Upload>
    ),
  });
};
