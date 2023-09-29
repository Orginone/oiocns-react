import React, { useState, useEffect } from 'react';
import MdEditor from 'for-editor';
import axios from 'axios';
import { FileItemShare } from '@/ts/base/model';
import { Spin } from 'antd';
import { shareOpenLink } from '@/utils/tools';

interface IProps {
  share: FileItemShare;
}

const Markdown: React.FC<IProps> = ({ share }) => {
  const [loaded, setLoaded] = useState(false);
  const [mdContent, setMdContent] = useState('');
  if (share.size > 1024 * 1024 * 20) {
    return <strong style={{ fontSize: 20 }}>文件太大,预览失败!</strong>;
  }
  useEffect(() => {
    axios.get(shareOpenLink(share.shareLink)).then((res) => {
      setLoaded(true);
      if (res.status === 200) {
        setMdContent(res.data);
      }
    });
  }, []);
  if (!loaded) {
    return (
      <Spin
        tip="加载中,请稍后..."
        size="large"
        style={{ marginTop: 'calc(50vh - 50px)', marginLeft: '50%' }}></Spin>
    );
  }
  return (
    <MdEditor
      preview
      height="100%"
      placeholder="请输入Markdown文本"
      lineNum={0}
      toolbar={{
        preview: true,
        save: false,
      }}
      value={mdContent}
    />
  );
};

export default Markdown;
