import React from 'react';
import { FileItemModel } from '@/ts/base/model';
import FullScreenModal from '@/executor/tools/fullScreen';
import JolPlayer from 'jol-player';

interface IProps {
  share: FileItemModel;
  finished: () => void;
}

const VideoView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    return (
      <FullScreenModal
        centered
        hideMaxed
        open={true}
        width={850}
        destroyOnClose
        title={share.name}
        bodyHeight={500}
        onCancel={() => finished()}>
        <JolPlayer
          style={{ width: '100%' }}
          option={{
            videoSrc: share.shareLink,
            height: 490,
            mode: 'heightFix',
            language: 'zh',
            pausePlacement: 'center',
            isShowScreenshot: false,
          }}
        />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};

export default VideoView;
