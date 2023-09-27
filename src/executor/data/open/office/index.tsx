import React from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { SheetViewer, DocxViewer } from 'react-office-viewer';
import { FileItemShare } from '@/ts/base/model';
import Markdown from './markdown';
import { shareOpenLink } from '@/utils/tools';
import { IDirectory } from '@/ts/core';

interface IProps {
  share: FileItemShare;
  current: IDirectory;
  finished: () => void;
}

const OfficeView: React.FC<IProps> = ({ share, finished, current }) => {
  let mkHtml = '<p></p>';
  const getHtml = (html: any) => {
    mkHtml = html;
  };
  const mkSave = async () => {
    let directory = current.directory;
    await current.delete();
    let blob = new Blob([mkHtml], { type: 'text/plain' });
    const file = new window.File([blob], share.name);
    await directory.createFile(file);
    finished();
  };
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
          return <Markdown share={share} getHtml={getHtml} />;
      }
      return <></>;
    };
    return (
      <FullScreenModal
        onSave={mkSave}
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
