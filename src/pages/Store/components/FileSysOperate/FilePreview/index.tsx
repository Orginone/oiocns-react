import { FileItemShare } from '@/ts/base/model';
import useWindowSize from '@/utils/windowsize';
import { Image, Modal } from 'antd';
import React from 'react';
import FileViewer from 'react-file-viewer';

interface IProps {
  share: FileItemShare;
  previewDone: () => void;
}

/** 文件预览 */
const FilePreview = ({ share, previewDone }: IProps) => {
  if (!share) return <></>;
  const size = useWindowSize();

  const getBody = () => {
    if (share.thumbnail.length > 0) {
      return <Image src={share.shareLink} title={share.name} preview={false} />;
    }
    return (
      <FileViewer
        fileType={share.extension.substring(1)}
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
      <div style={{ width: '100%', minHeight: size.height * 0.5 }}>{getBody()}</div>
    </Modal>
  );
};

export default FilePreview;
