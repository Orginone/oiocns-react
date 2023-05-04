import { Dropdown, Image, Row, Col, Card, Typography } from 'antd';

import React from 'react';
import cls from '../../index.module.less';
import { IFileSystemItem } from '@/ts/core';
import { FileItemModel } from '@/ts/base/model';
import { loadFileSysItemMenus } from '@/pages/Store/config/menuOperate';

const CardListContent = ({
  current,
  handleMenuClick,
  getThumbnail,
}: {
  current: IFileSystemItem;
  getThumbnail: (item: FileItemModel) => string;
  handleMenuClick: (key: string, node: IFileSystemItem) => void;
}) => {
  const FileCard = (el: IFileSystemItem) => (
    <Dropdown
      menu={{
        items: loadFileSysItemMenus(),
        onClick: ({ key }) => {
          handleMenuClick(key, el);
        },
      }}
      trigger={['contextMenu']}>
      <Card
        size="small"
        hoverable
        bordered={false}
        key={el.key}
        onDoubleClick={async () => {
          handleMenuClick('双击', el);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={cls.fileImage}>
          <Image
            preview={false}
            height={el.metadata.thumbnail ? 'auto' : 60}
            src={getThumbnail(el.metadata)}
            fallback="/icons/default_file.svg"
          />
        </div>
        <div className={cls.fileName} title={el.metadata.name}>
          <Typography.Text title={el.metadata.name} ellipsis>
            {el.metadata.name}
          </Typography.Text>
        </div>
      </Card>
    </Dropdown>
  );
  return (
    <Dropdown
      menu={{
        items: loadFileSysItemMenus(),
        onClick: ({ key }) => {
          handleMenuClick(key, current);
        },
      }}
      trigger={['contextMenu']}>
      <div
        className={cls.content}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <Row gutter={[16, 16]}>
          {current.children.map((el) => {
            return (
              <Col xs={8} sm={8} md={6} lg={4} xl={3} xxl={2} key={el.key}>
                {FileCard(el)}
              </Col>
            );
          })}
        </Row>
      </div>
    </Dropdown>
  );
};
export default CardListContent;
