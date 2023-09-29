import React from 'react';
import { JolPlayer } from 'jol-player';
import { FileItemShare } from '@/ts/base/model';
import { shareOpenLink } from '@/utils/tools';

interface IProps {
  share: FileItemShare;
}

const VideoView: React.FC<IProps> = ({ share }) => {
  if (share.shareLink) {
    return (
      <JolPlayer
        option={{
          width: 800,
          height: 400,
          language: 'zh',
          pausePlacement: 'center',
          isShowScreenshot: false,
          videoSrc: shareOpenLink(share.shareLink),
          videoType: share.contentType === 'video/stream' ? 'hls' : 'h264',
        }}
      />
    );
  }
  return <></>;
};

export default VideoView;
