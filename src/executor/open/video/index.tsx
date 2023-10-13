import React from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { JolPlayer } from 'jol-player';
import { FileItemShare } from '@/ts/base/model';
import { shareOpenLink } from '@/utils/tools';

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
            width: 830,
            height: 480,
            language: 'zh',
            pausePlacement: 'center',
            isShowScreenshot: false,
            poster: shareOpenLink(share.poster),
            videoSrc: shareOpenLink(share.shareLink),
            videoType: share.contentType === 'video/stream' ? 'hls' : 'h264',
          }}
        />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};

export default VideoView;
