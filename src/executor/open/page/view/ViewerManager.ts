import HostManagerBase from '../../../design/pageBuilder/render/HostManager';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import { IDisposable } from '@/ts/base/common';

export default class ViewerManager
  extends HostManagerBase<'view'>
  implements IDisposable
{
  constructor(pageFile: IPageTemplate) {
    super('view', pageFile);
  }

  dispose() {
    console.info('ViewerManager disposed');
  }
}
