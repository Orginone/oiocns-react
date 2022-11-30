import {
  Button,
  Dropdown,
  Segmented,
  Space,
  Image,
  Card,
  Divider,
  Typography,
  Upload,
  Breadcrumb,
  UploadProps,
  Row,
  Col,
} from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  CaretRightOutlined,
  EllipsisOutlined,
  FolderAddFilled,
} from '@ant-design/icons';
import * as im from 'react-icons/im';
// import * as fa from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import { RcFile } from 'antd/lib/upload/interface';
import { IFileSystemItem, IObjectItem } from '@/ts/core/store/ifilesys';
import Plan, { TaskModel } from '../plan';
import ResetNameModal from '../components/ResetName';
import { FaHourglassEnd, FaHourglassHalf } from 'react-icons/fa';
import { ProTable } from '@ant-design/pro-components';
import CoppyOrMove from '../components/CoppyOrMove';
import { getItemMenu } from '../components/CommonMenu';
type NameValue = {
  name: string;
  value: string;
};

const LeftTree = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('新建文件夹');
  const [coppyOrMoveTitle, setCoppyOrMoveTitle] = useState('复制到');
  const [currentTarget, setCurrentTarget] = useState<IObjectItem>();
  const [reNameKey, setReNameKey] = useState<string | undefined>('');
  const [segmentedValue, setSegmentedValue] = useState<'Kanban' | 'List'>('Kanban');
  const [taskList, setTaskList] = useState<TaskModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [current, setCurrent] = useState(docsCtrl.current);
  const [pageData, setPagedata] = useState<any[]>();
  const [createFileName, setCreateFileName] = useState<string>('');
  const [dicExtension, setDicExtension] = useState<NameValue[]>([]);
  const uploadRef = useRef<any>();
  const refreshUI = () => {
    if (docsCtrl.current != undefined) {
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
  const props: UploadProps = {
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
  const handleMenuClick = async (key: string, node: any) => {
    switch (key) {
      case '1': // 删除
        if (await docsCtrl.refItem(node.key)?.delete()) {
          docsCtrl.changCallback();
        }
        break;
      case '2': // 重命名
        setReNameKey(node.key);
        setCreateFileName(node.name);
        setTitle('重命名');
        setIsModalOpen(true);
        break;
      case '3': // 移动到
        setCurrentTarget(docsCtrl.refItem(node.key));
        setCoppyOrMoveTitle('移动到');
        setMoveModalOpen(true);
        break;
      case '4': // 复制到
        setCurrentTarget(docsCtrl.refItem(node.key));
        setCoppyOrMoveTitle('复制到');
        setMoveModalOpen(true);
        break;
      case '5': // 下载
        break;
      case '刷新': // 刷新
        docsCtrl.current?.loadChildren(true);
        docsCtrl.changCallback();
        break;
      case '新建文件夹': // 新建文件夹
        setReNameKey(undefined);
        setTitle('新建文件夹');
        setCreateFileName('');
        setIsModalOpen(true);
        break;
      case '上传': // 刷新
        if (uploadRef && uploadRef.current && uploadRef.current.upload) {
          uploadRef.current.upload.uploader.onClick();
        }
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Card
        title={
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <Typography.Link
              disabled={current?.parent == undefined ?? false}
              onClick={() => {
                docsCtrl.backup();
              }}>
              <im.ImArrowUp2 />
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                handleMenuClick('刷新', {});
              }}>
              <im.ImSpinner9 />
            </Typography.Link>
            <Upload {...props} ref={uploadRef}>
              <Typography.Link style={{ fontSize: 18 }}>
                <im.ImUpload />
              </Typography.Link>
            </Upload>
            <Typography.Link
              onClick={() => {
                handleMenuClick('新建文件夹', {});
              }}>
              <FolderAddFilled />
            </Typography.Link>
            <Breadcrumb separator={<CaretRightOutlined />}>
              {getBreadcrumb(current?.key ?? '', []).map((item) => {
                return (
                  <Breadcrumb.Item key={item.key}>
                    <a
                      onClick={async () => {
                        await docsCtrl.open(item.key);
                      }}>
                      {item.label}
                    </a>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
            {/* </div> */}
          </Space>
        }
        className={cls.container}
        extra={
          <Space wrap split={<Divider type="vertical" />} size={2}>
            <Typography.Link
              onClick={() => {
                setOpen(true);
              }}>
              {Uploading() ? <FaHourglassHalf /> : <FaHourglassEnd />}
            </Typography.Link>
            <Typography.Link>
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
            </Typography.Link>
          </Space>
        }
        bordered={false}>
        {segmentedValue === 'List' ? (
          pageData && (
            <ProTable
              cardProps={{
                bodyStyle: { padding: 0 },
              }}
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
                          height={32}
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
                        menu={{
                          items: getItemMenu(record),
                          onClick: ({ key }) => {
                            handleMenuClick(key, record);
                          },
                        }}
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
          <Dropdown
            menu={{
              items: getItemMenu({ key: '' }),
              onClick: ({ key }) => {
                handleMenuClick(key, {});
              },
            }}
            trigger={['contextMenu']}>
            <div
              className={cls.content}
              onContextMenu={(e) => {
                e.stopPropagation();
              }}>
              <Image.PreviewGroup>
                <Row gutter={[16, 16]}>
                  {current?.children.map((el) => {
                    return (
                      <Col xs={8} sm={8} md={6} lg={4} xl={3} xxl={2} key={el.key}>
                        <Dropdown
                          menu={{
                            items: getItemMenu(el),
                            onClick: ({ key }) => {
                              handleMenuClick(key, el);
                            },
                          }}
                          trigger={['contextMenu']}>
                          <Card
                            size="small"
                            hoverable
                            // bordered={false}
                            // className={cls.fileBox}
                            key={el.key}
                            onDoubleClick={() => {
                              docsCtrl.open(el.key);
                            }}
                            onContextMenu={(e) => {
                              e.stopPropagation();
                            }}
                            cover={
                              <div className={cls.fileImage}>
                                <Image
                                  width={'100%'}
                                  height={getPreview(el) ? 100 : 60}
                                  src={getThumbnail(el)}
                                  fallback="/icons/default_file.svg"
                                  preview={getPreview(el)}
                                />
                              </div>
                            }>
                            <div className={cls.fileName} title={el.name}>
                              <Typography.Text title={el.name} ellipsis>
                                {el.name}
                              </Typography.Text>
                            </div>
                          </Card>
                        </Dropdown>
                      </Col>
                    );
                  })}
                </Row>
              </Image.PreviewGroup>
            </div>
          </Dropdown>
        )}
        <ResetNameModal
          title={title}
          open={isModalOpen}
          reNameKey={reNameKey}
          value={createFileName}
          onChange={setIsModalOpen}
        />
        <CoppyOrMove
          currentTaget={currentTarget}
          open={moveModalOpen}
          title={coppyOrMoveTitle}
          onChange={setMoveModalOpen}
        />
        {/* <Modal
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
          <Input
            defaultValue={createFileName}
            onChange={(e: any) => {
              setCreateFileName(e.target.value);
            }}
            placeholder={title}
          />
        </Modal>*/}
      </Card>
      <Plan
        isOpen={open}
        taskList={taskList}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
export default LeftTree;
