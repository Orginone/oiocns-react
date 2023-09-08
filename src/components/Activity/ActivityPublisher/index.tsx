import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { Button, Form, Input } from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { ITarget } from '@/ts/core';
import { model } from '@/ts/base';

const ActivityPublisher: React.FC<{
  open: boolean;
  target: ITarget;
  finish: () => void;
}> = (props) => {
  const [activity, setActivity] = useState<model.ActivityType>({
    tags: [],
    likes: [],
    forward: [],
    comment: [],
    resource: [],
    content: [],
    typeName: 'Text',
  } as unknown as model.ActivityType);
  const publishActivity = () => {
    if (activity.content.length > 0) {
      props.target.resource.activityColl.insert(activity);
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
              setActivity({
                ...activity,
                content: e.target.value,
              });
            }}
          />
        </Form.Item>
        <Form.Item>
          <ImageUploader
            directory={props.target.directory}
            onChange={(fileList) => {
              setActivity({
                ...activity,
                resource: fileList.map((item) => item.shareInfo()),
              });
            }}></ImageUploader>
        </Form.Item>
      </Form>
    </FullScreenModal>
  );
};

export default ActivityPublisher;
