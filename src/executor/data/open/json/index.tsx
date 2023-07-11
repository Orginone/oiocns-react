import React from 'react';
import JsonRenderer from './JsonRenderer';
import FullScreenModal from '@/executor/tools/fullScreen';
import { FileItemModel } from '@/ts/base/model';
interface IProps {
  share: FileItemModel;
  finished: () => void;
}

const JsonView: React.FC<IProps> = ({ share, finished }) => {
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
        <JsonRenderer jsonUrl={share.shareLink} />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};
export default JsonView;
