import React, { useState, useEffect } from 'react';
import MdEditor from 'for-editor';
import FullScreenModal from '@/executor/tools/fullScreen';
import axios from 'axios';
import { getJsonText } from '@/utils';
import orgCtrl from '@/ts/controller';

interface IProps {
  finished: () => void;
  form: any;
}

const MyMdEditor: React.FC<IProps> = ({ finished, form }) => {
  const [isInitialization, setInitialization] = useState(true);
  const [mdContent, setMdContent] = useState(''); // 保存Markdown文本内容
  const init = () => {
    if (form.share.avatar.shareLink && isInitialization) {
      if (form.share.avatar.extension === '.json') {
        getJsonText(`/orginone/kernel/load/${form.share.avatar.shareLink}`).then(
          (data) => {
            setMdContent(data);
          },
        );
        return;
      }
      axios.get(`/orginone/kernel/load/${form.share.avatar.shareLink}`).then((res) => {
        if (res.status === 200) {
          setInitialization(false);
          setMdContent(res.data);
        }
      });
    }
  };
  useEffect(() => {
    init();
  }, []);

  // 工具栏菜单
  const toolbar = {
    h1: true, // h1
    h2: true, // h2
    h3: true, // h3
    h4: true, // h4
    // img: true, // 图片
    // link: true, // 链接
    code: true, // 代码块
    preview: true, // 预览
    //   expand: true, // 全屏
    /* v0.0.9 */
    undo: true, // 撤销
    redo: true, // 重做
    save: true, // 保存
    /* v0.2.3 */
    subfield: true, // 单双栏模式
  };

  // 弹窗关闭回到
  // previewDone = () => {
  //   saveFile()
  // }

  // 上传图片
  function uploadImg(file: any) {
    console.log('file', file);
  }
  // 输入内容改变
  function handleEditorChange(value: React.SetStateAction<string>) {
    console.log('handleChange', value);
    setMdContent(value);
  }
  // 保存输入内容
  function handleEditorSave(value: any) {
    console.log('handleEditorSave', value);
  }
  // 保存md文件
  const saveFile = async () => {
    const newTarget: any = form;
    await newTarget.delete();
    const blob = new Blob([mdContent], { type: 'text/plain' });
    const file = new window.File([blob], newTarget.metadata.name);

    await newTarget.directory.createFile(file);
    await orgCtrl.changCallback();
  };
  return (
    <>
      <FullScreenModal
        centered
        open={true}
        width={'50vw'}
        destroyOnClose
        title={'md文档'}
        onCancel={() => {
          finished();
          saveFile();
        }}>
        <MdEditor
          placeholder="请输入Markdown文本"
          height={'420px'}
          lineNum={0}
          toolbar={toolbar}
          value={mdContent}
          onChange={handleEditorChange}
          onSave={handleEditorSave}
          addImg={uploadImg}
        />
      </FullScreenModal>
    </>
  );
};

export default MyMdEditor;
