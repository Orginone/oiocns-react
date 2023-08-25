import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { Button, Form, Input } from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { IBelong, ISysFileInfo } from '@/ts/core';
export interface Activity {
  content: string;
  imageList: ISysFileInfo[];
}
const ActivityPublisher: React.FC<{
  open: boolean;
  space: IBelong;
  finish: () => void;
}> = (props) => {
  const [activity, setActivity] = useState<Activity>({
    content: '',
    imageList: [],
  });
  const publishActivity = () => {
    console.log(activity);
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
            maxLength={100}
            style={{ height: 120, resize: 'none' }}
            placeholder="说点什么......."
            onChange={(e) => {
              activity.content = e.target.value;
              setActivity(activity);
            }}
          />
        </Form.Item>
        <Form.Item>
          <ImageUploader
            directory={props.space.directory}
            onChange={(fileList) => {
              activity.imageList = fileList;
              setActivity(activity);
            }}></ImageUploader>
        </Form.Item>
      </Form>
    </FullScreenModal>
  );
};

export default ActivityPublisher;
