import {
  Card,
  Button,
  Modal,
  Input,
  Row,
  Col,
  message,
  Upload,
  UploadProps,
  Dropdown,
  Menu,
} from 'antd';
import React, { useState, useEffect } from 'react';
import {
  LeftOutlined,
  RightOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import useCloudStore from '@/store/cloud';
import Bucket from '@/module/cloud/buckets';
import cls from './index.module.less';
import IconImg from './icon';
import ObjectLay from '@/module/cloud/objectlay';
const { confirm } = Modal;

const LeftTree = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reNameOpen, setReNameOpen] = useState(false);
  const [reNameString, setReNameString] = useState<string>('');
  const [reNameDefault, setReNameDefault] = useState<ObjectLay>({} as ObjectLay);
  const [createFileName, setCreateFileName] = useState<any>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [gData, setGData] = useState<any[]>([]);
  const [key, setKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [onIndex, setOnIndex] = useState<any>(null);
  const CloudStore: any = useCloudStore();
  useEffect(() => {
    getBaseFileList();
  }, []);
  useEffect(() => {
    setGData(CloudStore.cloudTree);
  }, [CloudStore.cloudTree]);
  useEffect(() => {
    setFileList(CloudStore.cloudData);
  }, [CloudStore.cloudData]);
  useEffect(() => {
    let keys = [Bucket.Current.Key];
    setKey(btoa(unescape(encodeURIComponent(keys.join('/')))));
  }, [Bucket.Current]);

  const getBaseFileList = async (reload?: boolean) => {
    const res = await Bucket.GetContent(reload);
    setFileList(res);
  };
  const openModal = async () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 重命名
  const handleReName = async () => {
    await Bucket.FileReName(reNameDefault, reNameString);
    if (reNameDefault.IsDirectory) {
      let orgData = [...gData];
      Bucket.HandleReNameTree(orgData, reNameDefault.Key, reNameString);
      CloudStore.setCloudTree(orgData);
      await getBaseFileList(true); // 渲染文档
    } else {
      await getBaseFileList(true); // 渲染文档
    }

    setReNameOpen(false);
  };
  const handleReNameCancel = () => {
    setReNameOpen(false);
  };
  // 点击空白处
  const bankClick = () => {
    setOnIndex(null);
  };
  // 点击文件
  const fileClick = (e: any, index: number) => {
    e.stopPropagation();
    setOnIndex(index);
  };
  // 双击文件
  const fileDoubleClick = async (e: any, data: any) => {
    setOnIndex(null);
    e.stopPropagation();
    Bucket.Current = data;
    const res = await Bucket.GetContent();
    CloudStore.setChoudData(res);
  };
  //  刷新
  const fileReload = async () => {
    setLoading(true);
    await getBaseFileList(true); // 渲染文档
    CloudStore.setCloudTree(gData);
    setOnIndex(null);
    setLoading(false);
  };
  // 新建文件
  const handleOk = async () => {
    if (!createFileName || createFileName == '') {
      message.warning('文件名不能为空');
      return;
    }
    await Bucket.CreateFile(createFileName);
    let orgData = [...gData];
    await getBaseFileList(true); // 渲染文档
    Bucket.HandleEchoTree(orgData, Bucket.Current);
    CloudStore.setCloudTree(orgData);
    setIsModalOpen(false);
  };
  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFileName(e.target.value);
  };
  const renameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReNameString(e.target.value);
  };
  // 返回上一级
  const backFileList = () => {
    Bucket.BackFile();
    setFileList(Bucket.Current.children);
  };
  const fileReName = (data: ObjectLay) => {
    console.log('=========', data);

    setReNameDefault(data);
    setReNameString(data.Name);
    setReNameOpen(true);
  };
  // 删除文件
  const delFile = (data: any) => {
    confirm({
      title: '确认删除此文件?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        await Bucket.deleteFile(data);
        message.success('文件删除成功');
        await getBaseFileList(true); // 渲染文档
        let orgData = [...gData];
        Bucket.HandleDeleteTree(orgData, Bucket.Current);
        CloudStore.setCloudTree(orgData);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const props: UploadProps = {
    name: 'file',
    action: `/orginone/anydata/Bucket/Upload?shareDomain=user&prefix=${key}`,
    headers: {
      authorization: sessionStorage.Token,
    },
    showUploadList: false,
    async onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('文件上传成功');
        await getBaseFileList();
        CloudStore.setCloudTree(gData);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <Card className={cls.container}>
      <div className={cls.top}>
        <div className={cls.topBox}>
          <Button
            shape="circle"
            onClick={() => {
              backFileList();
            }}
            type="text"
            icon={<LeftOutlined />}></Button>
          <Button shape="circle" type="text" icon={<RightOutlined />}></Button>
          <Button
            shape="circle"
            loading={loading}
            type="text"
            onClick={() => {
              fileReload();
            }}
            icon={<SyncOutlined />}></Button>
        </div>
        <div className={cls.breadcrumb}></div>
      </div>
      <div className={cls.content}>
        <div className={cls.topBtn}>
          <Upload {...props}>
            <Button
              icon={<CloudUploadOutlined />}
              className={cls.leftBtn}
              type="primary"
              size="middle">
              上传文件
            </Button>
          </Upload>

          <Button
            onClick={() => {
              openModal();
            }}
            size="middle">
            新建文件夹
          </Button>
        </div>
        <div
          className={cls.file}
          onClick={() => {
            bankClick();
          }}>
          <Row gutter={[16, 16]}>
            {fileList.map((el: any, index: number) => {
              return (
                <Dropdown
                  key={el.Key}
                  overlay={
                    <Menu
                      items={[
                        {
                          key: '1',
                          label: (
                            <div
                              onClick={() => {
                                delFile(el);
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
                                fileReName(el);
                              }}>
                              重命名
                            </div>
                          ),
                        },
                        {
                          key: '3',
                          label: <div>移动文件</div>,
                        },
                      ]}
                    />
                  }
                  trigger={['contextMenu']}>
                  <Col
                    key={el.Key}
                    span={2}
                    onDoubleClick={(e) => {
                      fileDoubleClick(e, el);
                    }}
                    onClick={(e) => {
                      fileClick(e, index);
                    }}>
                    <div className={cls.onfileBox}>
                      <IconImg iconData={el}></IconImg>
                      {index == onIndex ? <div className={cls.circle}></div> : ''}

                      <div className={cls.fileName}>{el.Name}</div>
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
        title="新建文件夹"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Input onChange={changeInput} placeholder="Basic usage" />
      </Modal>
      <Modal
        destroyOnClose
        title="重命名"
        open={reNameOpen}
        onOk={handleReName}
        onCancel={handleReNameCancel}>
        <Input
          onChange={renameInput}
          placeholder="Basic usage"
          defaultValue={reNameString}
        />
      </Modal>
    </Card>
  );
};
export default LeftTree;
