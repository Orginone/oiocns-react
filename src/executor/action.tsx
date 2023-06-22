import { IDirectory, IEntity, IFileInfo, IMemeber, IMsgChat, ITarget } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { command, schema } from '@/ts/base';
import { Button, Drawer, List, Modal, Progress, Upload, message } from 'antd';
import QrCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import TypeIcon from '@/bizcomponents/GlobalComps/typeIcon';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { getConfigs } from '@/utils/excel/configs/index';
import { generateXlsx } from '@/utils/excel/index';
import { ErrorMessage } from '@/utils/excel/types';
import { ProTable } from '@ant-design/pro-components';

/** 执行非页面命令 */
export const executeCmd = (cmd: string, entity: any, args: any[]) => {
  switch (cmd) {
    case 'qrcode':
      return entityQrCode(entity);
    case 'refresh':
      return directoryRefresh(entity);
    case 'openChat':
      return openChat(entity);
    case 'copy':
    case 'move':
      return setCopyFiles(cmd, entity);
    case 'parse':
      return copyBoard(entity);
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
    case 'open':
      return openDirectory(entity);
    case 'standard':
      return uploadTemplate(entity);
  }
  return false;
};

/** 刷新目录 */
const directoryRefresh = (dir: IDirectory) => {
  dir.loadContent(true).then(() => {
    orgCtrl.changCallback();
  });
};

/** 进入目录 */
const openDirectory = (entity: IDirectory | ITarget | IEntity<schema.XEntity>) => {
  if ('identitys' in entity) {
    entity = entity.directory;
  }
  if ('files' in entity) {
    entity.loadContent().then(() => {
      orgCtrl.currentKey = entity.key;
      orgCtrl.changCallback();
    });
  }
  return false;
};

/** 拷贝/剪切文件 */
const setCopyFiles = (cmd: string, file: IFileInfo<schema.XEntity>) => {
  const key = cmd + '_' + file.id;
  for (const k of orgCtrl.user.copyFiles.keys()) {
    if (k.endsWith(file.id)) {
      orgCtrl.user.copyFiles.delete(k);
    }
  }
  orgCtrl.user.copyFiles.set(key, file);
  message.info(`${file.name}已放入剪切板`);
};

/** 剪贴板操作 */
const copyBoard = (dir: IDirectory) => {
  const datasource = [];
  for (const item of orgCtrl.user.copyFiles.entries()) {
    datasource.push({
      key: item[0],
      cmd: item[0].split('_')[0],
      file: item[1],
    });
  }
  const modal = Modal.info({
    icon: <></>,
    width: 500,
    content: (
      <List
        itemLayout="horizontal"
        dataSource={datasource}
        renderItem={({ key, cmd, file }) => {
          return (
            <List.Item
              style={{ cursor: 'pointer', padding: 6 }}
              actions={[
                <div key={file.name} style={{ width: 60 }}>
                  {cmd === 'copy' ? '复制' : '移动'}
                </div>,
              ]}
              onClick={async () => {
                modal.destroy();
                if (cmd === 'copy') {
                  await file.copy(dir);
                } else {
                  await file.move(dir);
                }
                orgCtrl.user.copyFiles.delete(key);
                orgCtrl.changCallback();
              }}>
              <List.Item.Meta
                avatar={<TypeIcon iconType={file.typeName} size={50} />}
                title={<strong>{file.name}</strong>}
                description={<EntityIcon entityId={file.directory.belongId} showName />}
              />
            </List.Item>
          );
        }}
      />
    ),
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
          command.emitter('-', 'taskList', dir);
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

/** 文件上传列表 */
export const FileTaskList = ({ directory }: { directory: IDirectory }) => {
  const [taskList, setTaskList] = useState(directory.taskList);
  useEffect(() => {
    const id = directory.taskEmitter.subscribe(() => {
      setTaskList([...directory.taskList]);
    });
    return () => {
      directory.unsubscribe(id);
    };
  }, []);
  const getProcess = (f: number, s: number) => {
    s = s == 0 ? 1 : s;
    return parseInt(((f * 10000.0) / s).toFixed(0)) / 100;
  };
  return (
    <Drawer
      title="操作记录"
      open
      width={500}
      placement="right"
      onClose={() => command.emitter('-', '-')}>
      <List
        itemLayout="horizontal"
        dataSource={taskList}
        renderItem={(item) => {
          return (
            <List.Item
              style={{ cursor: 'pointer', padding: 6 }}
              actions={[
                <div key={item.name} style={{ width: 60 }}>
                  {getProcess(item.finished, item.size)}%
                </div>,
              ]}>
              <List.Item.Meta
                avatar={<TypeIcon iconType={'文件'} size={50} />}
                title={<strong>{item.name}</strong>}
                description={
                  <Progress
                    status={item.finished === -1 ? 'exception' : 'success'}
                    percent={getProcess(item.finished, item.size)}
                  />
                }
              />
            </List.Item>
          );
        }}
      />
    </Drawer>
  );
};

/** 导入模板 */
export const uploadTemplate = (dir: IDirectory) => {
  const showErrors = (errors: ErrorMessage[]) =>
    Modal.info({
      icon: <></>,
      okText: '关闭',
      width: 860,
      title: '错误信息',
      maskClosable: true,
      content: (
        <ProTable
          dataSource={errors}
          cardProps={{ bodyStyle: { padding: 0 } }}
          scroll={{ y: 300 }}
          options={false}
          search={false}
          columns={[
            {
              title: '序号',
              valueType: 'index',
              width: 50,
            },
            {
              title: '表名',
              dataIndex: 'sheetName',
              key: 'sheetName',
            },
            {
              title: '行数',
              dataIndex: 'row',
              key: 'row',
            },
            {
              title: '错误信息',
              dataIndex: 'message',
              key: 'message',
              width: 460,
            },
          ]}
        />
      ),
    });
  const modal = Modal.info({
    icon: <></>,
    okText: '关闭',
    width: 610,
    title: '导入模板',
    maskClosable: true,
    content: (
      <>
        <Button onClick={async () => generateXlsx(getConfigs(dir), '导入模板')}>
          导入模板下载
        </Button>
        <Upload
          type={'drag'}
          showUploadList={false}
          style={{ width: 550, height: 300, marginTop: 10 }}
          beforeUpload={(file) => {
            const isXlsx =
              file.type ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isXlsx) {
              message.error(`${file.name} 不是一个 xlsx 文件`);
            }
            return isXlsx;
          }}
          customRequest={async (options) => {
            modal.destroy();
            command.emitter('-', 'taskList', dir);
            const file = options.file as File;
            dir.createBatch(
              file,
              (errors) => showErrors(errors),
              (error) => message.error(error),
            );
          }}>
          <div style={{ color: 'limegreen', fontSize: 22 }}>点击或拖拽至此处上传</div>
        </Upload>
      </>
    ),
  });
};
