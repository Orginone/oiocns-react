import { model } from '@/ts/base';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { IDirectory } from '../directory';

export interface IPageTemplate extends IStandardFileInfo<model.XPageTemplate> {}

export class PageTemplate
  extends StandardFileInfo<model.XPageTemplate>
  implements IPageTemplate
{
  get cacheFlag() {
    return 'pageTemplate';
  }
  constructor(_metadata: model.XPageTemplate, _directory: IDirectory) {
    super(_metadata, _directory, _directory.resource.templateColl);
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.templateColl);
    }
    return false;
  }
  async move(destination: IDirectory): Promise<boolean> {
    if (this.allowMove(destination)) {
      return await super.moveTo(destination.id, destination.resource.templateColl);
    }
    return false;
  }
}
