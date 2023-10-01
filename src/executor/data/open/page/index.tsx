import { ViewerHost } from '@/components/PageBuilder/view/ViewerHost';
import FullScreenModal from '@/executor/tools/fullScreen';
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
      onCancel={() => finished()}
      children={<ViewerHost current={current} />}
    />
  );
};

export default TemplateView;
