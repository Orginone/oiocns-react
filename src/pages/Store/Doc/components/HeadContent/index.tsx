import React from 'react';
import { Breadcrumb, Divider, Space, Typography } from 'antd';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { IFileSystemItem } from '@/ts/core/store/ifilesys';
import { ImSpinner9, ImArrowUp2, ImUpload, ImFolderPlus, ImPlay3 } from 'react-icons/im';

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

const CardTiltle = ({
  handleMenuClick,
  current,
}: {
  handleMenuClick: (key: string, node: IFileSystemItem) => void;
  current: IFileSystemItem;
}) => {
  return (
    <Space wrap split={<Divider type="vertical" />} size={2}>
      <Typography.Link
        disabled={current?.parent == undefined ?? false}
        onClick={() => docsCtrl.backup()}>
        <ImArrowUp2 />
      </Typography.Link>
      <Typography.Link onClick={() => handleMenuClick('刷新', current)}>
        <ImSpinner9 />
      </Typography.Link>
      <Typography.Link onClick={() => handleMenuClick('上传', current)}>
        <ImUpload />
      </Typography.Link>
      <Typography.Link onClick={() => handleMenuClick('新建文件夹', current)}>
        <ImFolderPlus />
      </Typography.Link>
      <Breadcrumb separator={<ImPlay3 />}>
        {getBreadcrumb(current?.key ?? '', []).map((item) => {
          return (
            <Breadcrumb.Item key={item.key}>
              <a onClick={async () => await docsCtrl.open(item.key)}>{item.label}</a>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Space>
  );
};
export default CardTiltle;
