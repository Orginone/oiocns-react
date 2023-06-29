import React from 'react';
import { Image } from 'antd';
import { FileItemModel } from '@/ts/base/model';

interface IProps {
  share: FileItemModel;
  finished: () => void;
}

const ImageView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    return (
      <Image
        style={{ display: 'none' }}
        src={share.shareLink}
        preview={{
          visible: true,
          destroyOnClose: true,
          onVisibleChange: (v) => {
            if (!v) {
              finished();
            }
          },
        }}
      />
    );
  }
  finished();
  return <></>;
};

export default ImageView;
