import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileItemShare } from '@/ts/base/model';
import { Spin } from 'antd';
import { shareOpenLink } from '@/utils/tools';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor } from '@wangeditor/editor';

interface IProps {
  share: FileItemShare;
  getHtml: (html: any) => void;
}

const Markdown: React.FC<IProps> = ({ share,getHtml }) => {
  const [loaded, setLoaded] = useState(false);
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState('<p></p>');
  getHtml(html);
  useEffect(() => {
    axios.get(shareOpenLink(share.shareLink)).then((res) => {
      setLoaded(true);
      if (res.status === 200) {
        setHtml(res.data);
      }
    });
  }, []);
  //编辑器功能列表配置，目前是默认配置
  const toolbarConfig = {};
  const editorConfig = {
    placeholder: '请输入内容...',
  };
  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  if (!loaded) {
    return (
      <Spin
        tip="加载中,请稍后..."
        size="large"
        style={{ marginTop: 'calc(50vh - 50px)', marginLeft: '50vw' }}></Spin>
    );
  }
  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '15px' }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px' }}
        />
      </div>
    </>
  );
};

export default Markdown;
