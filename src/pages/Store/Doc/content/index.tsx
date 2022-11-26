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
  UploadProps,
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
import { sleep } from '@/ts/base/common';
import { RcFile } from 'antd/lib/upload/interface';

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
  const props: UploadProps = {
    multiple: true,
    showUploadList: false,
    async customRequest(options) {
      try {
        const file: RcFile = options.file as RcFile;
        console.log(file.uid, file.size, await file.text());
      } catch (ex) {
        console.log(ex);
      }
      await sleep(10000);
    },
  };
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
          <Upload {...props}>
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
