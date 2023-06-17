import React from 'react';
import { Image } from 'antd';
import { FileItemShare } from '@/ts/base/model';
import FullScreenModal from '../../../config/tools/fullScreen';

interface IProps {
  share: FileItemShare;
  finished: () => void;
}

const ImageView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    return (
      <FullScreenModal
        centered
        open={true}
        width={'50vw'}
        destroyOnClose
        title={share.name}
        onCancel={() => finished()}>
        <Image src={share.shareLink} preview={false} />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};

export default ImageView;
