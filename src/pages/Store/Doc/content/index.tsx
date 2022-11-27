import {
  Card,
  Upload,
  Dropdown,
  Menu,
  Modal,
  Input,
  Breadcrumb,
  UploadProps,
  Image,
  Space,
  Divider,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  ArrowUpOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  FolderAddOutlined,
  CloudSyncOutlined,
  AppstoreOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import cls from './index.module.less';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import { RcFile } from 'antd/lib/upload/interface';
import { IFileSystemItem } from '@/ts/core/store/ifilesys';
import Plan, { TaskModel } from '../plan';
type NameValue = {
  name: string;
  value: string;
};

const LeftTree = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('新建文件夹');
  const [reNameKey, setReNameKey] = useState('');
  const [taskList, setTaskList] = useState<TaskModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(docsCtrl.current);
  const [createFileName, setCreateFileName] = useState<any>();
  const [dicExtension, setDicExtension] = useState<NameValue[]>([]);
  const refreshUI = () => {
    if (docsCtrl.current != undefined) {
      setCurrent({ ...docsCtrl.current });
    }
  };
  useEffect(() => {
    fetch('/fileext.json').then(async (res) => {
      const temp: NameValue[] = await res.json();
      if (temp && temp.length > 0) {
        setDicExtension(temp);
      }
    });
    const id = docsCtrl.subscribe(refreshUI);
    return () => {
      docsCtrl.unsubscribe(id);
    };
  }, []);
  const Uploading = () => {
    for (const t of taskList) {
      if (t.process < 1) {
        return true;
      }
    }
    return false;
  };
  const props: UploadProps = {
    multiple: true,
    showUploadList: false,
    async customRequest(options) {
      try {
        if (docsCtrl.current) {
          const file: RcFile = options.file as RcFile;
          const task: TaskModel = {
            process: 0,
            name: file.name,
            size: file.size,
            createTime: new Date(),
            group: docsCtrl.current.name,
          };
          taskList.push(task);
          docsCtrl.current?.upload(file.name, file, (p) => {
            task.process = p;
            setTaskList([...taskList]);
          });
          setOpen(true);
        }
      } catch (ex) {
        console.log(ex);
      }
    },
  };
  const getThumbnail = (item: IFileSystemItem) => {
    if (item.target.thumbnail.length > 0) {
      return item.target.thumbnail;
    }
    let prifex = '/icons/';
    if (item.target.extension === '') {
      return prifex + 'default_folder.svg';
    } else {
      for (const d of dicExtension) {
        if (d.name === item.target.extension.toLowerCase()) {
          return prifex + 'file_type_' + d.value + '.svg';
        }
      }
    }
    return prifex + 'default_file.svg';
  };
  const getPreview = (el: any) => {
    if (el.target.thumbnail?.length > 0) {
      return {
        src: '/orginone/anydata/bucket/load/' + el.target.shareLink,
      };
    }
    return false;
  };
  const getBreadcrumb = (key: string, items: any[]) => {
    const item = docsCtrl.refItem(key);
    if (item) {
      items.unshift({
        key: item.key,
        label: item.name,
      });
      if (item.parent) {
        items = getBreadcrumb(item.parent.key, items);
      }
    }
    return items;
  };
  const getItemMenu = (el: any) => {
    if (el.key === '主目录')
      return [
        {
          key: '4',
          label: <div>复制到</div>,
        },
      ];
    return [
      {
        key: '1',
        label: (
          <div
            onClick={async () => {
              if (await docsCtrl.refItem(el.key)?.delete()) {
                docsCtrl.changCallback();
              }
            }}>
            删除文件
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div
            onClick={() => {
              setTitle('重名名');
              setReNameKey(el.key);
              setCreateFileName(el.name);
              setIsModalOpen(true);
            }}>
            重命名
          </div>
        ),
      },
      {
        key: '3',
        label: <div>移动到</div>,
      },
      {
        key: '4',
        label: <div>复制到</div>,
      },
    ];
  };
  return (
    <>
      <Card className={cls.container}>
        <div className={cls.docheader}>
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <Typography.Link
              disabled={current?.parent == undefined ?? false}
              onClick={() => {
                docsCtrl.backup();
              }}>
              <ArrowUpOutlined />
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                docsCtrl.current?.loadChildren(true);
                docsCtrl.changCallback();
              }}>
              <SyncOutlined />
            </Typography.Link>
            <Upload {...props}>
              <Typography.Link style={{ fontSize: 18 }}>
                <CloudUploadOutlined />
              </Typography.Link>
            </Upload>
            <Typography.Link
              onClick={() => {
                setCreateFileName('');
                setTitle('新建文件夹');
                setIsModalOpen(true);
              }}>
              <FolderAddOutlined />
            </Typography.Link>
            <div style={{ width: '100%', cursor: 'pointer' }}>
              <Breadcrumb>
                {getBreadcrumb(current?.key ?? '', []).map((item) => {
                  return (
                    <>
                      <Breadcrumb.Item
                        key={item.key}
                        onClick={async () => {
                          await docsCtrl.open(item.key);
                        }}>
                        {item.label}
                      </Breadcrumb.Item>
                    </>
                  );
                })}
              </Breadcrumb>
            </div>
          </Space>
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <Typography.Link
              onClick={() => {
                setOpen(true);
              }}>
              {Uploading() ? <LoadingOutlined /> : <CloudSyncOutlined />}
            </Typography.Link>
            <Typography.Link>
              <AppstoreOutlined />
            </Typography.Link>
          </Space>
        </div>
        <div className={cls.content}>
          <Image.PreviewGroup>
            {current?.children.map((el) => {
              return (
                <Dropdown
                  key={el.key}
                  overlay={<Menu items={getItemMenu(el)} />}
                  trigger={['contextMenu']}>
                  <Card
                    hoverable
                    className={cls.fileBox}
                    key={el.key}
                    onDoubleClick={() => {
                      docsCtrl.open(el.key);
                    }}>
                    <Image
                      height={80}
                      src={getThumbnail(el)}
                      fallback="/icons/default_file.svg"
                      preview={getPreview(el)}></Image>
                    <div className={cls.fileName} title={el.name}>
                      {el.name}
                    </div>
                  </Card>
                </Dropdown>
              );
            })}
          </Image.PreviewGroup>
        </div>
        <Modal
          destroyOnClose
          title={title}
          open={isModalOpen}
          onOk={async () => {
            setIsModalOpen(false);
            if (createFileName != '') {
              if (title === '重名名') {
                if (await docsCtrl.refItem(reNameKey)?.rename(createFileName)) {
                  docsCtrl.changCallback();
                }
              } else {
                if (await docsCtrl.current?.create(createFileName)) {
                  docsCtrl.changCallback();
                }
              }
            }
          }}
          onCancel={() => {
            setCreateFileName('');
            setIsModalOpen(false);
          }}>
          <Input
            defaultValue={createFileName}
            onChange={(e: any) => {
              setCreateFileName(e.target.value);
            }}
            placeholder={title}
          />
        </Modal>
      </Card>
      <Plan
        isOpen={open}
        taskList={taskList}
        onClose={() => {
          setOpen(false);
        }}></Plan>
    </>
  );
};
export default LeftTree;
