import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { vscodeDark } from '@uiw/codemirror-theme-vscode';
// import { langs } from '@uiw/codemirror-extensions-langs';
import FullScreenModal from '@/executor/tools/fullScreen';
import { getJsonText } from '@/utils';
import axios from 'axios';
import orgCtrl from '@/ts/controller';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import './index.less';
import { ProConfigProvider } from '@ant-design/pro-components';

const { DirectoryTree } = Tree;
interface IProps {
  finished: () => void;
  form: any;
  supportFiles: string[];
  isProject: boolean;
}

const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[],
): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

/** 文件预览 */
const CodeEditor = ({ finished, form, supportFiles, isProject }: IProps) => {
  const [mdContent, setMdContent] = useState(''); // 保存Markdown文本内容
  const onTextChange = React.useCallback((value: string) => {
    setMdContent(value);
  }, []);
  const [extensions, setExtensions] = useState(langs.markdown);
  const [current, setCurrent] = useState(form);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const initData = () => {
    switch (current.share.avatar?.extension) {
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
    if (current.share.avatar?.shareLink) {
      if (current.share.avatar.extension === '.json') {
        getJsonText(
          '/orginone/anydata/bucket/load/' + current.share.avatar.shareLink,
        ).then((data) => {
          setMdContent(data);
        });
        return;
      }
      axios
        .get('/orginone/anydata/bucket/load/' + current.share.avatar.shareLink)
        .then((res) => {
          if (res.status === 200) {
            setMdContent(res.data);
          }
        });
    }
  };
  const initTreeData = (data, _treeData) => {
    data.children.forEach((m: any) => {
      _treeData.push({
        key: m.key,
        title: m.name,
        directory: m,
      });
    });
    data.files.forEach((m: any) => {
      _treeData.push({
        key: m.key,
        title: m.name,
        isLeaf: true,
        file: m,
      });
    });
  };
  const init = async () => {
    initData();
    if (isProject) {
      setCurrent(null);
      await form.loadContent();
      const _treeData: DataNode[] = [];

      initTreeData(form, _treeData);
      setTreeData(_treeData);
    }
  };
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (current) {
      initData();
    }
  }, [current]);

  // 保存md文件
  const saveFile = async () => {
    if (!current) return;
    const newTarget: any = current;
    await newTarget.delete();
    const blob = new Blob([mdContent], { type: 'text/plain' });
    const file = new window.File([blob], newTarget.metadata.name);

    await newTarget.directory.createFile(file);
    await orgCtrl.changCallback();
  };
  const onLoadData = async ({ key, children, directory }: any) => {
    if (children) {
      return;
    }
    await directory.loadContent();
    let _children: any[] = [];
    initTreeData(directory, _children);
    setTreeData((origin) => updateTreeData(origin, key, _children));
  };

  return (
    <ProConfigProvider dark={true}>
      <FullScreenModal
        centered
        open={true}
        width={'1200px'}
        destroyOnClose
        fullScreen
        title={form.name}
        onCancel={() => {
          finished();
          saveFile();
        }}>
        <div className={'code'}>
          {isProject && (
            <div className={'left'}>
              <DirectoryTree
                rootStyle={{ whiteSpace: 'nowrap' }}
                showLine={true}
                loadData={onLoadData}
                onSelect={(keys, e) => {
                  if (e.node.file) {
                    setCurrent(e.node.file);
                  }
                }}
                treeData={treeData}></DirectoryTree>
            </div>
          )}
          <div className="right">
            <div
              style={{
                marginBottom: '10px',
                marginLeft: '5px',
                position: 'fixed',
                top: '60px',
              }}>
              {current?.name}
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
