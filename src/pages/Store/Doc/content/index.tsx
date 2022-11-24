import {
  Card,
  Button,
  Row,
  Col,
  Upload,
  Dropdown,
  Menu,
  Modal,
  Input,
  Breadcrumb,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  ArrowUpOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  FolderAddOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import cls from './index.module.less';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';

const LeftTree = () => {
  const [title, setTitle] = useState('新建文件夹');
  const [reNameKey, setReNameKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(docsCtrl.current);
  const [createFileName, setCreateFileName] = useState<any>();
  const refreshUI = () => {
    if (docsCtrl.current) {
      setCurrent({ ...docsCtrl.current });
    }
  };
  useEffect(() => {
    const id = docsCtrl.subscribe(refreshUI);
    return () => {
      docsCtrl.unsubscribe(id);
    };
  }, []);
  // // 双击文件
  // const fileDoubleClick = async (e: any, data: any) => {
  //   setOnIndex(null);
  //   e.stopPropagation();
  //   Bucket.Current = data;
  //   const res = await Bucket.GetContent();
  //   CloudStore.setChoudData(res);
  // };
  // // 删除文件
  // const delFile = (data: any) => {
  //   confirm({
  //     title: '确认删除此文件?',
  //     icon: <ExclamationCircleOutlined />,
  //     okText: '确认',
  //     okType: 'danger',
  //     cancelText: '取消',
  //     async onOk() {
  //       await Bucket.deleteFile(data);
  //       message.success('文件删除成功');
  //       await getBaseFileList(true); // 渲染文档
  //       let orgData = [...gData];
  //       Bucket.HandleDeleteTree(orgData, Bucket.Current);
  //       CloudStore.setCloudTree(orgData);
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     },
  //   });
  // };
  // const props: UploadProps = {
  //   name: 'file',
  //   action: `/orginone/anydata/Bucket/Upload?shareDomain=user&prefix=${key}`,
  //   headers: {
  //     authorization: sessionStorage.Token,
  //   },
  //   showUploadList: false,
  //   async onChange(info) {
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === 'done') {
  //       message.success('文件上传成功');
  //       await getBaseFileList();
  //       CloudStore.setCloudTree(gData);
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };
  const getImgSrc = (type: string) => {
    let prifex = '/icons/';
    switch (type) {
      case '':
        prifex += 'default_folder';
        break;
      case 'file':
        prifex += 'default_file';
        break;
      default:
        prifex += 'file_type_' + type;
        break;
    }
    return prifex + '.svg';
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
            onClick={() => {
              // delFile(el);
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
    <Card className={cls.container}>
      <div className={cls.top}>
        <div className={cls.topBox}>
          <Button
            shape="circle"
            onClick={() => {
              docsCtrl.backup();
            }}
            type="text"
            disabled={current?.parent == undefined ?? false}
            icon={<ArrowUpOutlined />}></Button>
          <Button
            shape="circle"
            type="text"
            onClick={() => {
              docsCtrl.current?.loadChildren(true);
              docsCtrl.changCallback();
            }}
            icon={<SyncOutlined />}></Button>
          <Upload>
            <Button shape="circle" type="text" icon={<CloudUploadOutlined />}></Button>
          </Upload>
          <Button
            shape="circle"
            type="text"
            icon={<FolderAddOutlined />}
            onClick={() => {
              setCreateFileName('');
              setTitle('新建文件夹');
              setIsModalOpen(true);
            }}></Button>
          <MoreOutlined />
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
      </div>
      <div className={cls.content}>
        <div className={cls.file}>
          <Row gutter={16}>
            {current?.children.map((el) => {
              return (
                <Dropdown
                  key={el.key}
                  overlay={<Menu items={getItemMenu(el)} />}
                  trigger={['contextMenu']}>
                  <Col
                    key={el.key}
                    span={2}
                    onDoubleClick={() => {
                      docsCtrl.open(el.key);
                    }}>
                    <div className={cls.fileBox}>
                      <img src={getImgSrc(el.extension)} className={cls.fileImg}></img>
                      <div className={cls.fileName}>{el.name}</div>
                    </div>
                  </Col>
                </Dropdown>
              );
            })}
          </Row>
        </div>
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
  );
};
export default LeftTree;
