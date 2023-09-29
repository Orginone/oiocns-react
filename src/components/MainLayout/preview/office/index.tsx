import React from 'react';
import { SheetViewer, DocxViewer } from 'react-office-viewer';
import { FileItemShare } from '@/ts/base/model';
import Markdown from './markdown';
import { shareOpenLink } from '@/utils/tools';

interface IProps {
  share: FileItemShare;
}

const OfficeView: React.FC<IProps> = ({ share }) => {
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
    return <LoadViewer />;
  }
  return <></>;
};

export default OfficeView;
