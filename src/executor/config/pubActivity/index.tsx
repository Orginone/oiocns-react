import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { Button, Form } from 'antd';
import MultImageUploader from '../../tools/multUploader';
import { IActivity, MessageType } from '@/ts/core';
import { model } from '@/ts/base';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor } from '@wangeditor/editor';

const ActivityPublisher: React.FC<{
  activity: IActivity;
  finish: () => void;
}> = (props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [resource, setResource] = useState<model.FileItemShare[]>([]);
  const publishActivity = () => {
    if (editor) {
      const text = editor.getText();
      const html = editor.getHtml();
      if (text.length > 0) {
        if (`<p>${text}</p>` === html) {
          props.activity.send(text, MessageType.Text, resource, []);
        } else {
          props.activity.send(html, MessageType.Html, resource, []);
        }
        props.finish();
      }
    }
  };
  return (
    <FullScreenModal
      open
      {...props}
      width={'50vw'}
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
          <Toolbar
            editor={editor}
            mode="simple"
            defaultConfig={{
              excludeKeys: [
                'insertVideo',
                'uploadVideo',
                'uploadImage',
                'fullScreen',
                'insertImage',
                'insertImage',
                'deleteImage',
                'editImage',
                'viewImageLink',
                'imageWidth30',
                'imageWidth50',
                'imageWidth100',
              ],
            }}
          />
          <Editor
            mode="simple"
            onCreated={setEditor}
            defaultConfig={{ placeholder: '在此输入内容' }}
            style={{ height: '200px' }}
          />
        </Form.Item>
        <Form.Item>
          <MultImageUploader
            maxCount={9}
            types={['image', 'vedio']}
            directory={props.activity.session.target.directory}
            onChange={(fileList) => {
              setResource(fileList.map((item) => item.shareInfo()) || []);
            }}></MultImageUploader>
        </Form.Item>
      </Form>
    </FullScreenModal>
  );
};

export default ActivityPublisher;
