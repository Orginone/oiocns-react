import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import FullScreenModal from '@/executor/tools/fullScreen';
import { FileItemModel } from '@/ts/base/model';
interface IProps {
  share: FileItemModel;
  finished: () => void;
}

const MarkdownView: React.FC<IProps> = ({ share, finished }) => {
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
        <MarkdownRenderer markdownUrl={share.shareLink} />
      </FullScreenModal>
    );
  }
  finished();
  return <></>;
};
export default MarkdownView;
