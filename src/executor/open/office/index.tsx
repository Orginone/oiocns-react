import React from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { SheetViewer, DocxViewer } from 'react-office-viewer';
import { FileItemShare } from '@/ts/base/model';
import Markdown from './markdown';
import { shareOpenLink } from '@/utils/tools';

interface IProps {
  share: FileItemShare;
  finished: () => void;
}

const OfficeView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    const LoadViewer = () => {
      const config = {
        locale: 'zh',
        timeout: 5000,
        fileName: share.name,
        file: shareOpenLink(share.shareLink),
      };
      switch (share.extension) {
        case '.xls':
        case '.xlsx':
          return <SheetViewer {...config} />;
        case '.docx':
          return <DocxViewer {...config} />;
        case '.pdf':
          return (
            <iframe
              width={'100%'}
              height={'100%'}
              loading="eager"
              name={share.name}
              src={shareOpenLink(share.shareLink)}
            />
          );
        case '.md':
          return <Markdown share={share} />;
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
