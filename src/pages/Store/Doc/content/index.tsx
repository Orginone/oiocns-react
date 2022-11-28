import * as antd from 'antd';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
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
  const props: antd.UploadProps = {
    multiple: true,
    showUploadList: false,
    async customRequest(options) {
      if (docsCtrl.current) {
        const file: RcFile = options.file as RcFile;
        const task: TaskModel = {
          process: 0,
          name: file.name,
          size: file.size,
          createTime: new Date(),
          group: docsCtrl.current.name,
        };
        docsCtrl.current?.upload(file.name, file, (p) => {
          if (p === 0) {
            taskList.push(task);
          }
          task.process = p;
          setTaskList([...taskList]);
        });
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
        icon: <fa.FaTrashAlt />,
        label: (
          <div
            onClick={async () => {
              if (await docsCtrl.refItem(el.key)?.delete()) {
                docsCtrl.changCallback();
              }
            }}>
            删除
          </div>
        ),
      },
      {
        key: '2',
        icon: <fa.FaEdit />,
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
      <antd.Card className={cls.container}>
        <div className={cls.docheader}>
          <antd.Space wrap split={<antd.Divider type="vertical" />} size={2}>
            <antd.Typography.Link
              disabled={current?.parent == undefined ?? false}
              onClick={() => {
                docsCtrl.backup();
              }}>
              <im.ImArrowUp2 />
            </antd.Typography.Link>
            <antd.Typography.Link
              onClick={() => {
                docsCtrl.current?.loadChildren(true);
                docsCtrl.changCallback();
              }}>
              <im.ImSpinner9 />
            </antd.Typography.Link>
            <antd.Upload {...props}>
              <antd.Typography.Link style={{ fontSize: 18 }}>
                <im.ImUpload />
              </antd.Typography.Link>
            </antd.Upload>
            <antd.Typography.Link
              onClick={() => {
                setCreateFileName('');
                setTitle('新建文件夹');
                setIsModalOpen(true);
              }}>
              <im.ImFolderPlus />
            </antd.Typography.Link>
            <div style={{ width: '100%', cursor: 'pointer' }}>
              <antd.Breadcrumb separator={<im.ImPlay3 />}>
                {getBreadcrumb(current?.key ?? '', []).map((item) => {
                  return (
                    <>
                      <antd.Breadcrumb.Item
                        key={item.key}
                        onClick={async () => {
                          await docsCtrl.open(item.key);
                        }}>
                        {item.label}
                      </antd.Breadcrumb.Item>
                    </>
                  );
                })}
              </antd.Breadcrumb>
            </div>
          </antd.Space>
          <antd.Space wrap split={<antd.Divider type="vertical" />} size={2}>
            <antd.Typography.Link
              onClick={() => {
                setOpen(true);
              }}>
              {Uploading() ? <fa.FaHourglassHalf /> : <fa.FaHourglassEnd />}
            </antd.Typography.Link>
            <antd.Typography.Link>
              <fa.FaTh />
            </antd.Typography.Link>
          </antd.Space>
        </div>
        <div
          className={cls.content}
          onContextMenu={(e) => {
            e.preventDefault();
          }}>
          <antd.Image.PreviewGroup>
            {current?.children.map((el) => {
              return (
                <antd.Dropdown
                  key={el.key}
                  overlay={<antd.Menu items={getItemMenu(el)} />}
                  trigger={['contextMenu']}>
                  <antd.Card
                    hoverable
                    className={cls.fileBox}
                    key={el.key}
                    onDoubleClick={() => {
                      docsCtrl.open(el.key);
                    }}>
                    <antd.Image
                      height={80}
                      src={getThumbnail(el)}
                      fallback="/icons/default_file.svg"
                      preview={getPreview(el)}></antd.Image>
                    <div className={cls.fileName} title={el.name}>
                      {el.name}
                    </div>
                  </antd.Card>
                </antd.Dropdown>
              );
            })}
          </antd.Image.PreviewGroup>
        </div>
        <antd.Modal
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
          <antd.Input
            defaultValue={createFileName}
            onChange={(e: any) => {
              setCreateFileName(e.target.value);
            }}
            placeholder={title}
          />
        </antd.Modal>
      </antd.Card>
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
