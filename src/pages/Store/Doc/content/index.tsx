import * as antd from 'antd';
import * as im from 'react-icons/im';
// import * as fa from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import { RcFile } from 'antd/lib/upload/interface';
import { IFileSystemItem } from '@/ts/core/store/ifilesys';
import Plan, { TaskModel } from '../plan';
import ResetNameModal from '../components/ResetName';
import { FaEdit, FaHourglassEnd, FaHourglassHalf, FaTrashAlt } from 'react-icons/fa';
import { ImDownload, ImFilesEmpty, ImRedo } from 'react-icons/im';
import { ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Segmented, Space, Image } from 'antd';
import { AppstoreOutlined, BarsOutlined, EllipsisOutlined } from '@ant-design/icons';
type NameValue = {
  name: string;
  value: string;
};

const LeftTree = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('新建文件夹');
  const [reNameKey, setReNameKey] = useState('');
  const [segmentedValue, setSegmentedValue] = useState<'Kanban' | 'List'>('Kanban');
  const [taskList, setTaskList] = useState<TaskModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(docsCtrl.current);
  const [pageData, setPagedata] = useState<any[]>();
  const [createFileName, setCreateFileName] = useState<string>('');
  const [dicExtension, setDicExtension] = useState<NameValue[]>([]);
  const uploadRef = useRef<any>();
  const refreshUI = () => {
    if (docsCtrl.current != undefined) {
      console.log('当前对象', docsCtrl.current);
      setPagedata([...docsCtrl.current.children]);
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
  const getItemMenu = (el: IFileSystemItem) => {
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
        icon: <FaTrashAlt />,
        label: (
          <div
            onClick={async () => {
              console.log('删除', el.key);
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
        icon: <FaEdit />,
        label: (
          <div
            onClick={() => {
              setTitle('重命名');
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
        icon: <ImRedo />,
        label: <div>移动到</div>,
      },
      {
        key: '4',
        icon: <ImFilesEmpty />,
        label: <div>复制到</div>,
      },
      {
        key: '5',
        icon: <ImDownload />,
        label: <div>下载</div>,
      },
    ];
  };
  const contentRightMenu = () => {
    return [
      {
        key: '1',
        icon: <im.ImSpinner9 />,
        label: <div>刷新</div>,
        onClick: () => {
          docsCtrl.current?.loadChildren(true);
          docsCtrl.changCallback();
        },
      },
      {
        key: '2',
        icon: <im.ImUpload />,
        label: '上传',
        onClick: () => {
          if (uploadRef && uploadRef.current && uploadRef.current.upload) {
            uploadRef.current.upload.uploader.onClick();
          }
        },
      },
      {
        key: '3',
        icon: <im.ImFolderPlus />,
        label: <div>新建文件夹</div>,
        onClick: () => {
          setReNameKey('');
          setTitle('新建文件夹');
          setCreateFileName('');
          setIsModalOpen(true);
        },
      },
    ];
  };
  return (
    <>
      <antd.Card className={cls.container} bordered={false}>
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
            <antd.Upload {...props} ref={uploadRef}>
              <antd.Typography.Link style={{ fontSize: 18 }}>
                <im.ImUpload />
              </antd.Typography.Link>
            </antd.Upload>
            <antd.Typography.Link
              onClick={() => {
                setReNameKey('');
                setTitle('新建文件夹');
                setCreateFileName('');
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
              {Uploading() ? <FaHourglassHalf /> : <FaHourglassEnd />}
            </antd.Typography.Link>
            <antd.Typography.Link>
              <Segmented
                value={segmentedValue}
                onChange={(value) => setSegmentedValue(value as 'Kanban' | 'List')}
                options={[
                  {
                    value: 'List',
                    icon: <BarsOutlined />,
                  },
                  {
                    value: 'Kanban',
                    icon: <AppstoreOutlined />,
                  },
                ]}
              />
            </antd.Typography.Link>
          </antd.Space>
        </div>
        {segmentedValue === 'List' ? (
          pageData && (
            <ProTable
              headerTitle={<></>}
              search={false}
              pagination={false}
              options={false}
              columns={[
                {
                  dataIndex: 'name',
                  title: '名称',
                  render: (_, record) => {
                    return (
                      <Space>
                        <Image
                          height={20}
                          src={getThumbnail(record)}
                          fallback="/icons/default_file.svg"
                          preview={getPreview(record)}
                        />
                        {_}
                      </Space>
                    );
                  },
                },
                {
                  dataIndex: ['target', 'dateCreated'],
                  title: '更新时间',
                  valueType: 'dateTime',
                  width: 200,
                },
                {
                  dataIndex: 'opration',
                  title: '操作',
                  width: 80,
                  render: (_, record) => {
                    return (
                      <Dropdown
                        className={cls['operation-btn']}
                        menu={{ items: getItemMenu(record) }}
                        key={record.key}
                        trigger={['click']}>
                        <Button shape="round" size="small">
                          <EllipsisOutlined />
                        </Button>
                      </Dropdown>
                    );
                  },
                },
              ]}
              expandable={{
                childrenColumnName: 'nochild',
              }}
              onRow={(recod) => {
                return {
                  onDoubleClick: () => {
                    docsCtrl.open(recod.key);
                  },
                };
              }}
              rowKey={'key'}
              dataSource={pageData}
            />
          )
        ) : (
          <antd.Dropdown menu={{ items: contentRightMenu() }} trigger={['contextMenu']}>
            <div
              className={cls.content}
              onContextMenu={(e) => {
                e.stopPropagation();
              }}>
              <antd.Image.PreviewGroup>
                {current?.children.map((el) => {
                  return (
                    <antd.Dropdown
                      key={el.key}
                      menu={{ items: getItemMenu(el) }}
                      trigger={['contextMenu']}>
                      <antd.Card
                        hoverable
                        bordered={false}
                        className={cls.fileBox}
                        key={el.key}
                        onDoubleClick={() => {
                          docsCtrl.open(el.key);
                        }}
                        onContextMenu={(e) => {
                          e.stopPropagation();
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
          </antd.Dropdown>
        )}
        <ResetNameModal
          title={title}
          open={isModalOpen}
          reNameKey={reNameKey}
          value={createFileName}
          onChange={setIsModalOpen}
        />

        {/* <antd.Modal
          destroyOnClose
          title={title}
          open={isModalOpen}
          onOk={async () => {
            setIsModalOpen(false);
            if (createFileName != '') {
              if (title === '重命名') {
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
        </antd.Modal>*/}
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
