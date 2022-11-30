import { Dropdown, Image, Row, Col, Card, Typography } from 'antd';

import React from 'react';
import { IFileSystemItem } from '@/ts/core/store/ifilesys';
import { getItemMenu } from '../CommonMenu';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import cls from '../../index.module.less';

const CardListContent = ({
  pageData,
  handleMenuClick,
  getPreview,
  getThumbnail,
}: {
  pageData: IFileSystemItem[];
  getThumbnail: (item: IFileSystemItem) => string;
  handleMenuClick: (key: string, node: IFileSystemItem) => void;
  getPreview: (node: IFileSystemItem) => false | { src: string };
}) => {
  const FileCard = (el: IFileSystemItem) => (
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
        bordered={false}
        key={el.key}
        onDoubleClick={() => {
          docsCtrl.open(el.key);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={cls.fileImage}>
          <Image
            height={getPreview(el) ? 'auto' : 60}
            src={getThumbnail(el)}
            fallback="/icons/default_file.svg"
            preview={getPreview(el)}
          />
        </div>
        <div className={cls.fileName} title={el.name}>
          <Typography.Text title={el.name} ellipsis>
            {el.name}
          </Typography.Text>
        </div>
      </Card>
    </Dropdown>
  );
  return (
    <Dropdown
      menu={{
        items: getItemMenu({ key: '' }),
        onClick: ({ key }) => {
          handleMenuClick(key, {} as IFileSystemItem);
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
            {pageData.map((el) => {
              return (
                <Col xs={8} sm={8} md={6} lg={4} xl={3} xxl={2} key={el.key}>
                  {FileCard(el)}
                </Col>
              );
            })}
          </Row>
        </Image.PreviewGroup>
      </div>
    </Dropdown>
  );
};
export default CardListContent;
