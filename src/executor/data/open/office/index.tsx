import React from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { SheetViewer, DocxViewer, PdfViewer } from '@orginone/react-office-viewer';
import { FileItemShare } from '@/ts/base/model';

interface IProps {
  share: FileItemShare;
  finished: () => void;
}

const OfficeView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    const LoadViewer = () => {
      const config = {
        locale: 'zh',
        timeout: 5000,
        fileName: share.name,
        file: share.shareLink,
      };
      switch (share.extension) {
        case '.xls':
        case '.xlsx':
          return <SheetViewer {...config} />;
        case '.docx':
          return <DocxViewer {...config} />;
        case '.pdf':
          return <PdfViewer {...config} />;
      }
      return <></>;
    };
    return (
      <FullScreenModal
        centered
        open={true}
        fullScreen
        width={'80vw'}
        destroyOnClose
        title={share.name}
        bodyHeight={'80vh'}
        onCancel={() => finished()}>
        <LoadViewer />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};

export default OfficeView;
