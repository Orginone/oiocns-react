import FullScreenModal from '@/components/Common/fullScreen';
import { ViewerHost } from '@/executor/design/pageBuilder/view/ViewerHost';
import ViewerManager from '@/executor/design/pageBuilder/view/ViewerManager';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import React from 'react';

interface IProps {
  current: IPageTemplate;
  finished: () => void;
}

const TemplateView: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'页面预览'}
      onCancel={() => finished()}>
      <ViewerHost ctx={{ view: new ViewerManager(current) }} />
    </FullScreenModal>
  );
};

export default TemplateView;
