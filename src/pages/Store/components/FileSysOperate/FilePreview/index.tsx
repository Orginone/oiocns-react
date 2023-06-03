import { FileItemShare } from '@/ts/base/model';
import useWindowSize from '@/utils/windowsize';
import { Image, Modal } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import FileViewer from 'react-file-viewer';

interface IProps {
  share: FileItemShare;
  previewDone: () => void;
}

/** 文件预览 */
const FilePreview = ({ share, previewDone }: IProps) => {
  if (!share) return <></>;
  const [view, setView] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    setTimeout(() => {
      setView(true);
    }, 100);
  }, []);

  const getBody = () => {
    if (share.thumbnail && share.thumbnail.length > 0) {
      return <Image src={share.shareLink} title={share.name} preview={false} />;
    }
    // 自定义文件类型处理
    switch (share.extension) {
      case '.mat':
        break;
    }
    return (
      <FileViewer
        key={view}
        fileType={share.extension?.substring(1)}
        filePath={share.shareLink}
        errorComponent={(val: any) => {
          console.log('err=', val);
        }}
      />
    );
  };

  return (
    <Modal
      centered
      open={true}
      destroyOnClose
      title={share.name}
      width={size.width * 0.8}
      onCancel={() => previewDone()}
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}>
      <div style={{ width: '100%', height: size.height * 0.5 }}>{getBody()}</div>
    </Modal>
  );
};

export default FilePreview;
