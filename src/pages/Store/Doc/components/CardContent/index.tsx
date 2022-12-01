import { Dropdown, Image, Row, Col, Card, Typography } from 'antd';

import React from 'react';
import cls from '../../index.module.less';
import { getItemMenu } from '../CommonMenu';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import { FileItemModel } from '@/ts/base/model';

const CardListContent = ({
  pageData,
  handleMenuClick,
  getPreview,
  getThumbnail,
}: {
  pageData: FileItemModel[];
  getThumbnail: (item: FileItemModel) => string;
  handleMenuClick: (key: string, node: FileItemModel) => void;
  getPreview: (node: FileItemModel) => false | { src: string };
}) => {
  const FileCard = (el: FileItemModel) => (
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
        items: getItemMenu(undefined),
        onClick: ({ key }) => {
          handleMenuClick(key, {} as FileItemModel);
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
