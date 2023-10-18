import { Command, schema } from '@/ts/base';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { IDirectory } from '../directory';

export interface IPageTemplate extends IStandardFileInfo<schema.XPageTemplate> {
  command: Command;
}

export class PageTemplate
  extends StandardFileInfo<schema.XPageTemplate>
  implements IPageTemplate
{
  canDesign: boolean = true;
  command: Command;
  get cacheFlag() {
    return 'pages';
  }
  constructor(_metadata: schema.XPageTemplate, _directory: IDirectory) {
    super(_metadata, _directory, _directory.resource.templateColl);
    this.command = new Command();
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
