import React from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { JolPlayer } from 'jol-player';
import { FileItemShare } from '@/ts/base/model';

interface IProps {
  share: FileItemShare;
  finished: () => void;
}

const VideoView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    return (
      <FullScreenModal
        centered
        hideMaxed
        open={true}
        destroyOnClose
        title={share.name}
        width={850}
        bodyHeight={500}
        onCancel={() => finished()}>
        <JolPlayer
          option={{
            videoSrc: `/orginone/kernel/load/${share.shareLink}`,
            width: 830,
            height: 480,
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
