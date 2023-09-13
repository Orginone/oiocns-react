import React from 'react';
import { Image } from 'antd';
import { FileItemShare } from '@/ts/base/model';

interface IProps {
  share: FileItemShare;
  finished: () => void;
}

const ImageView: React.FC<IProps> = ({ share, finished }) => {
  if (share.shareLink) {
    return (
      <Image
        style={{ display: 'none' }}
        src={`/orginone/kernel/load/${share.shareLink}`}
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
