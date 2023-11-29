import React from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import DesignerManager from '../pageBuilder/design/DesignerManager';
import { DesignerHost } from '../pageBuilder/design/DesignerHost';

interface IProps {
  current: IPageTemplate;
  finished: () => void;
}

const TemplateModal: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'页面配置'}
      onCancel={() => finished()}>
      <DesignerHost ctx={{ view: new DesignerManager(current) }} />
    </FullScreenModal>
  );
};

export default TemplateModal;
