import {
  IApplication,
  IDirectory,
  IEntity,
  IFileInfo,
  IMemeber,
  IMsgChat,
  ISysFileInfo,
  ITarget,
  TargetType,
} from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { command, model, schema } from '@/ts/base';
import { Drawer, List, Modal, Progress, Tabs, Upload, message } from 'antd';
import QrCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { uploadTemplate } from './tools/uploadTemplate';
import TypeIcon from '@/components/Common/GlobalComps/typeIcon';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { TaskModel } from '@/ts/base/model';
/** 执行非页面命令 */
export const executeCmd = (cmd: string, entity: any, args: any[]) => {
  switch (cmd) {
    case 'qrcode':
      return entityQrCode(entity);
    case 'refresh':
      return directoryRefresh(entity);
    case 'openChat':
      return openChat(entity);
    case 'download':
      window.open((entity as ISysFileInfo).shareInfo().shareLink, '_black');
      return;
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
    case 'folderUpload':
      return folderUpload(entity);
    case 'open':
      return openDirectory(entity);
    case 'standard':
      return uploadTemplate(entity);
    case 'online':
    case 'outline':
      return onlineChanged(cmd, entity);
  }
  return false;
};


/** 文件夹上传 */
const folderUpload = (
  dir: IDirectory,
) => {
  const parseFilesToTree=(files: any)=> {
    const tree: any = [];
    const data = Object.values(files);
    data.forEach((file: any) => {
      const path = file.webkitRelativePath.split("/");
      let currentNode = tree;
      for (let i = 0; i < path.length - 1; i++) {
        const currentName = path[i];
        let childNode = currentNode.find((node: any) => node.name === currentName);
        if (!childNode) {
          childNode = { name: currentName, children: [], type: 1 };
          currentNode.push(childNode);
        }
        currentNode = childNode.children;
      }
      currentNode.push({ file: file, name: file.name, type: 2 });
    });
    uploadFolder(tree)
  }
    // 测试上传
    const uploadFolder = async (tree: any, target1: any = '') => {
      let target2 = null;
      target1 ? target2 = target1 : target2 = dir
      if (target2) {
        for (const item of tree) {
          // setTarget(target);
          if (item.file && item.type === 2) {
            if (await target2.createFile(item.file)) {
              console.log(target2)
              orgCtrl.changCallback();
            }
          }
          if (item.type === 1) {
            // 拿到刚创建的文件夹信息
            // console.log(item,123123123);
            // debugger
            const folder: any = await target2.create({name: item.name, code: item.name, remark: item.name})
            // {name: 'aaaaaaaaa', code: 'ceode', remark: '123123'}
            uploadFolder(item.children, folder)
          }
        }
      }
    }
  const uploadFolderChange = (e: any) => {
    if (e.file.uid === e.fileList[0].uid) {
      let list: any = []
      e.fileList.forEach((item: any) => {
        list.push(item.originFileObj)
      })
      parseFilesToTree(list)
    }
    modal.destroy()
  }
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
        directory={true}
        style={{ width: 550, height: 300 }}
        multiple={true}
        
        customRequest={async (options) => {
          // modal.destroy();
          // command.emitter('-', 'taskList', dir);
          // const file = options.file as File;
          // if (file) {
          //   await dir.createFile(file)
          // }
        }}
        onChange={uploadFolderChange}
        >
        <div style={{ color: 'limegreen', fontSize: 22 }}>点击或拖拽至此处上传</div>
      </Upload>
    ),
  });
};
/** 刷新目录 */
const directoryRefresh = (dir: IDirectory | IApplication) => {
  dir.loadContent(true).then(() => {
    orgCtrl.changCallback();
  });
};

/** 进入目录 */
const openDirectory = (
  entity: IDirectory | IApplication | ITarget | IEntity<schema.XEntity>,
) => {
  if ('identitys' in entity && entity.typeName != TargetType.Station) {
    entity = entity.directory;
  }
  if ('files' in entity || 'works' in entity) {
    entity.loadContent().then(() => {
      orgCtrl.currentKey = entity.key;
      orgCtrl.changCallback();
    });
    return;
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
  const datasource: any[] = [];
  for (const item of orgCtrl.user.copyFiles.entries()) {
    if (
      (item[1].typeName === '人员' && dir.typeName === '成员目录') ||
      (item[1].typeName !== '人员' && dir.typeName === '目录')
    ) {
      datasource.push({
        key: item[0],
        cmd: item[0].split('_')[0],
        file: item[1],
      });
    }
  }
  const modal = Modal.confirm({
    icon: <></>,
    width: 500,
    cancelText: '取消',
    okText: '全部',
    onOk: async () => {
      for (const item of datasource) {
        if (item.cmd === 'copy') {
          await item.file.copy(dir);
        } else {
          await item.file.move(dir);
        }
        orgCtrl.user.copyFiles.delete(item.key);
      }
      orgCtrl.changCallback();
      modal.destroy();
    },
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

/** 上下线提醒 */
const onlineChanged = (cmd: string, info: model.OnlineInfo) => {
  if (info.userId === '0') {
    if (cmd === 'online') {
      message.success({
        duration: 1,
        content: `终端${info.remoteAddr}[${info.connectionId}]建立连接`,
      });
    } else {
      message.error({
        duration: 1,
        content: `终端${info.remoteAddr}[${info.connectionId}]断开连接`,
      });
    }
  } else {
    orgCtrl.user.findEntityAsync(info.userId).then((target) => {
      if (target) {
        if (cmd === 'online') {
          message.success({
            duration: 1,
            content: (
              <div style={{ display: 'contents' }}>
                {target.name} [{target.code}] 从{info.remoteAddr}上线啦
              </div>
            ),
          });
        } else {
          message.error({
            duration: 1,
            content: (
              <div style={{ display: 'contents' }}>
                {target.name} [{target.code}] 从{info.remoteAddr}下线啦
              </div>
            ),
          });
        }
      }
    });
  }
};

/** 文件上传 */
const uploadFile = (
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
        multiple
        type={'drag'}
        maxCount={100}
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
  const loadTasks = (tlst: TaskModel[]) => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={tlst}
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
    );
  };
  return (
    <Drawer
      title="操作记录"
      open
      width={500}
      placement="right"
      onClose={() => command.emitter('-', '-')}>
      <Tabs
        centered
        items={[
          {
            key: 'uploading',
            label: '上传中',
            children: loadTasks(
              taskList.filter((i) => i.finished >= 0 && i.finished < i.size),
            ),
          },
          {
            key: 'uploaded',
            label: '已完成',
            children: loadTasks(
              taskList.filter((i) => i.finished < 0 || i.finished >= i.size),
            ),
          },
        ]}
      />
    </Drawer>
  );
};
