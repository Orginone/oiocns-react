import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { Button, Form, Input } from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { IActivity } from '@/ts/core';
import { model } from '@/ts/base';

const ActivityPublisher: React.FC<{
  open: boolean;
  activity: IActivity;
  finish: () => void;
}> = (props) => {
  const [content, setContent] = useState<string>('');
  const [resource, setResource] = useState<model.FileItemShare[]>([]);
  const publishActivity = () => {
    if (content.length > 0) {
      props.activity.send(content, resource, []);
      props.finish();
    }
  };
  return (
    <FullScreenModal
      {...props}
      destroyOnClose
      title="发布动态"
      footer={
        <Button type="primary" onClick={publishActivity}>
          发布动态
        </Button>
      }
      onCancel={() => props.finish()}>
      <Form autoComplete="off">
        <Form.Item>
          <Input.TextArea
            showCount
            maxLength={1000}
            style={{ height: 120, resize: 'none' }}
            placeholder="说点什么......."
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item>
          <ImageUploader
            directory={props.activity.session.target.directory}
            onChange={(fileList) => {
              setResource(fileList.map((item) => item.shareInfo()) || []);
            }}></ImageUploader>
        </Form.Item>
      </Form>
    </FullScreenModal>
  );
};

export default ActivityPublisher;
