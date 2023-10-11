import React from 'react';
import { Image } from 'antd';
import { FileItemShare } from '@/ts/base/model';
import { shareOpenLink } from '@/utils/tools';

interface IProps {
  share: FileItemShare;
}

const ImageView: React.FC<IProps> = ({ share }) => {
  if (share.shareLink) {
    return (
      <Image
        width={'100%'}
        src={shareOpenLink(share.shareLink)}
        preview={{
          destroyOnClose: true,
        }}
        placeholder={<Image preview={false} src={share.thumbnail} width={'100%'} />}
      />
    );
  }
  return <></>;
};

export default ImageView;
