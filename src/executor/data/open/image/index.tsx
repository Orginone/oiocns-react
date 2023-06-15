import React from 'react';
import { Modal, Image } from 'antd';
import { FileItemShare } from '@/ts/base/model';
import useWindowSize from '@/utils/windowsize';

interface IProps {
  share: FileItemShare;
  finished: () => void;
}

const ImageView: React.FC<IProps> = ({ share, finished }) => {
  const size = useWindowSize();
  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    return (
      <Modal
        centered
        open={true}
        destroyOnClose
        title={share.name}
        width={size.width * 0.5}
        onCancel={() => finished()}
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}>
        <Image src={share.shareLink} />
      </Modal>
    );
  }
  finished();
  return <></>;
};

export default ImageView;
