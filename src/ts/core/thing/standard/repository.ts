import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { ITarget } from '@/ts/core';
import axios from 'axios';

export interface IRepository extends IStandardFileInfo<any> {
  /** http链接 */
  HTTPS: string;
  /** ssh链接 */
  SSH: string;
  /** 创建仓库 */
  // createRepo(data: any, target: ITarget): Promise<any>;
  /** 获取仓库目录内容或文件内容 */
  RepoContent(datauri?: string): Promise<any>;
}

export class Repository extends StandardFileInfo<any> implements IRepository {
  HTTPS: string;
  SSH: string;
  constructor(metadata: any, dir: IDirectory) {
    super(metadata, dir, dir.resource.repositoryColl);
    this.HTTPS = metadata.HTTPS;
    this.SSH = metadata.SSH;
  }
  get cacheFlag(): string {
    return 'Repository';
  }
  async copy(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.repositoryColl);
    }
    return false;
  }

  async move(destination: IDirectory): Promise<boolean> {
    if (this.allowCopy(destination)) {
      return await super.copyTo(destination.id, destination.resource.repositoryColl);
    }
    return false;
  }
  async RepoContent(datauri: string = '') {
    // console.log(`/warehouse/${this.directory.target.code}/${this.name}` + datauri);
    // let res = await axios.get(`/warehouse/${this.directory.target.code}/${this.name}` + datauri)
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}` + datauri,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
    // return res;
  }
  public static async createRepo(data: any, target: ITarget) {
    let res = await axios.post('/warehouse/repo/create', {
      Code: target.code,
      RepoName: data.name,
    });
    return res;
  }
}
