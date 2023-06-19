import React from 'react';
import { FileItemModel } from '@/ts/base/model';
import FullScreenModal from '@/executor/tools/fullScreen';
import FileViewer from 'react-file-viewer';

interface IProps {
  share: FileItemModel;
  finished: () => void;
}

const OfficeView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
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
        <FileViewer
          key={share.key}
          fileType={share.extension?.substring(1)}
          filePath={share.shareLink}
          errorComponent={(val: any) => {
            console.log('err=', val);
          }}
        />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};

export default OfficeView;
