import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { langs } from '@uiw/codemirror-extensions-langs';
import FullScreenModal from '@/components/Common/fullScreen';
import { getJsonText } from '@/utils';
import axios from 'axios';
import './index.less';
import { ProConfigProvider } from '@ant-design/pro-components';
import { FileItemShare } from '@/ts/base/model';
import { shareOpenLink } from '@/utils/tools';
interface IProps {
  finished: () => void;
  share: FileItemShare;
}

/** 文件预览 */
const CodeEditor = ({ finished, share }: IProps) => {
  const [mdContent, setMdContent] = useState(''); // 保存Markdown文本内容
  const onTextChange = React.useCallback((value: string) => {
    setMdContent(value);
  }, []);
  const [extensions, setExtensions] = useState(langs.markdown);
  const initData = () => {
    switch (share.extension) {
      case '.vue':
        setExtensions(langs.vue);
        break;
      case '.tsx':
        setExtensions(langs.tsx);
        break;
      case '.jsx':
        setExtensions(langs.jsx);
        break;
      case '.js':
        setExtensions(langs.javascript());
        break;
      case '.json':
        setExtensions(langs.json);
        break;
      case '.html':
        setExtensions(langs.html());
        break;
      case '.java':
        setExtensions(langs.java);
        break;
      default:
        break;
    }
    if (share.shareLink) {
      if (share.extension === '.json') {
        getJsonText(shareOpenLink(share.shareLink)).then((data) => {
          setMdContent(data);
        });
        return;
      }
      axios.get(shareOpenLink(share.shareLink)).then((res) => {
        if (res.status === 200) {
          setMdContent(res.data);
        }
      });
    }
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <ProConfigProvider dark={true}>
      <FullScreenModal
        centered
        open={true}
        width={'1200px'}
        destroyOnClose
        fullScreen
        title={share.name}
        onCancel={() => {
          finished();
        }}>
        <div className={'code'}>
          <div className="right">
            <div
              style={{
                marginBottom: '10px',
                marginLeft: '5px',
                position: 'fixed',
                top: '60px',
              }}>
              {share.name}
            </div>
            <CodeMirror
              // width={isProject ? '890px' : '1200px'}
              width={'calc(100vw - 330px)'}
              theme={vscodeDark}
              value={mdContent}
              onChange={onTextChange}
              extensions={[extensions]}
            />
          </div>
        </div>
      </FullScreenModal>
    </ProConfigProvider>
  );
};
export default CodeEditor;
