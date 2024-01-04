import { Command, common, kernel, model } from '@/ts/base';
import { IDirectory } from '../directory';
import { IStandardFileInfo, StandardFileInfo } from '../fileinfo';
import { ITarget } from '@/ts/core';
import axios from 'axios';
import {
  PageAll,
  directoryNew,
  directoryOperates,
  entityOperates,
  fileOperates,
  newWarehouse,
  warehouseOperates,
} from '../../public';
import { Work, IWork } from '../../work';

export interface IRepository extends IStandardFileInfo<any> {
  works: IWork[];
  /** 触发器 */
  command: Command;
  /** http链接 */
  HTTPS: string;
  /** ssh链接 */
  SSH: string;
  /** pr列表 */
  pullRequestList: model.pullRequestList[];
  /** 这个是其他的合并信息，查询其他合并到BaseBranch分支（这里是master）
   * 的pr信息（查询条件为Pull.BaseBranch == Pulls[i].BaseBranch&&Pulls[i].IsClosed==false），
   * 因为合并完一个后，需要判断其他的合并是否存在冲突
   **/
  // Pulls: any[];
  /** 仓库名称 */
  RepoName: string;
  /** target */
  target: ITarget;
  /** 创建仓库 */
  // createRepo(data: any, target: ITarget): Promise<any>;
  /** 获取仓库目录内容或文件内容 */
  RepoContent(datauri?: string): Promise<any>;
  /** 获取仓库提交历史列表 */
  HistoryCommitList(datauri?: string): Promise<any>;
  /** 获取提交代码比对信息 */
  Codecomparison(datauri?: string): Promise<any>;
  /** 获取代码分支列表 默认活跃陈旧 */
  Codebranches(datauri?: string): Promise<any>;
  /** 仓库设置->管理分支信息+保护分支信息 */
  Codesettingbranches(datauri?: string): Promise<any>;
  /** 仓库设置->保护分支更改 */
  SetProtectedbranches(datauri?: string, requestData?: object): Promise<any>;
  /** 仓库设置->默认分支更改 */
  SetDefaultBranch(branch: string): Promise<any>;
  /** 请求创建pr比对 */
  PullRequestcomparison(datauri?: string): Promise<any>;
  /** 判断合并请求是否存在冲突 */
  IsPullRequestcomparison(datauri?: string): Promise<any>;
  /** 点击页面上的“合并请求” */
  MergePull(requestData: PullRequest): Promise<any>;
  /** PR列表内的提交史 */
  PRCommits(requestData: PullRequest): Promise<any>;
  /** PR列表内的文件变动 */
  PRFiles(requestData: PullRequest): Promise<any>;
  // eslint-disable-next-line prettier/prettier
  
  /** 获取pr列表 0开启 1关闭 */
  isPullList(is: number): model.pullRequestList[];
  /** 根据id查找办事 */
  findWork(id: string): Promise<IWork | undefined>;
  /** 加载办事如果没有创建 */
  loadWorks(reload?: boolean | undefined): Promise<IWork[]>;
  /** 根据 IssueId 查找单个条目的方法 */
  findPRByIssueId(issueId: number): model.pullRequestList | undefined;
}

interface PullRequest {
  IssueId: number;
  UserName: string;
  HeadRepo: string;
  BaseRepo: string;
  Status: number;
  HeadBranch: string;
  BaseBranch: string;
  HasMerged: boolean;
  MergeCommitId: string; // 根据实际情况调整数据类型
  MergeBase: string; // 根据实际情况调整数据类型
  IsClosed?: boolean; //MergePull需要
}

export class Repository extends StandardFileInfo<any> implements IRepository {
  HTTPS: string;
  SSH: string;
  command: Command;
  works: IWork[];
  node: model.WorkNodeModel | undefined;
  constructor(metadata: any, dir: IDirectory) {
    // console.log(metadata, dir);
    super(metadata, dir, dir.resource.repositoryColl);
    this.HTTPS = metadata.HTTPS;
    this.SSH = metadata.SSH;
    this.command = new Command();
    this.works = [];
    this.loadWorks(true);
    this.loadNode(true);
  }

  get cacheFlag(): string {
    return 'Repository';
  }

  get pullRequestList(): model.pullRequestList[] {
    return this.metadata.pullRequestList;
  }
  get RepoName() {
    return this.metadata.name;
  }
  // get target(): ITarget {
  //   return this.target;
  // }
  // 根据 IssueId 查找单个条目的方法
  findPRByIssueId(issueId: number): model.pullRequestList | undefined {
    return this.metadata.pullRequestList.find(
      (pr: model.pullRequestList) => pr.IssueId === issueId,
    );
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

  override operates(): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    if (this.target.hasRelationAuth()) {
      operates.push(newWarehouse, warehouseOperates.WarehousePermission);
    }
    return operates;
  }

  public getPulls(): PullRequest[] {
    return this.pullRequestList.map((value) => {
      return {
        IssueId: value.IssueId,
        UserName: value.PosterUser.name,
        HeadRepo: value.HeadRepo,
        BaseRepo: value.BaseRepo,
        Status: value.Status,
        HeadBranch: value.HeadBranch,
        BaseBranch: value.BaseBranch,
        HasMerged: value.HasMerged,
        MergeCommitId: value.MergeCommitId,
        MergeBase: value.MergeBase,
        IsClosed: value.IsClosed,
      };
    });
  }
  public isPullList(is: number = 0) {
    if (is == 0) {
      return this.pullRequestList?.filter((item) => !item.IsClosed);
    }
    if (is == 1) {
      return this.pullRequestList?.filter((item) => item.IsClosed);
    }
    return this.pullRequestList;
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
  async HistoryCommitList(datauri: string = '') {
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}/commits` + datauri,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async Codecomparison(datauri: string = '') {
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}/commit` + datauri,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  public static async createRepo(data: any, target: ITarget) {
    let res = await axios.post('/warehouse/repo/create', {
      Code: target.code,
      RepoName: data.name,
    });
    return res;
  }
  /*
  没有则分集合返回
  all 所有分支集合
  */
  async Codebranches(datauri: string = '') {
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}/branches` + datauri,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  /*
  /master 分支名 此分支保护信息
  */
  async Codesettingbranches(datauri: string = '') {
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}/settings/branches` +
          datauri,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async SetProtectedbranches(datauri: string = '', requestData: object = {}) {
    try {
      let res = await axios.post(
        `/warehouse/${this.directory.target.code}/${this.name}/settings/branches` +
          datauri,
        requestData,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async SetDefaultBranch(branch: string) {
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}/settings/branches/default_branch?branch=${branch}`,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async PullRequestcomparison(datauri: string = '') {
    try {
      let res = await axios.get(
        `/warehouse/${this.directory.target.code}/${this.name}/compare${datauri}`,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async IsPullRequestcomparison(datauri: string = '') {
    try {
      let res = await axios.post(
        `/warehouse/${this.directory.target.code}/${this.name}/compare${datauri}`,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async MergePull(requestData: PullRequest) {
    let res = await axios.post(
      `/warehouse/${this.directory.target.code}/${this.name}/pulls/merge?merge_style=create_merge_commit`,
      {
        Pull: requestData,
        Pulls: this.getPulls().filter(
          (pull) => pull.IssueId !== requestData.IssueId && !pull.IsClosed,
        ),
      },
    );
    return res.data;
  }
  async PRCommits(requestData: PullRequest) {
    let res = await axios.post(
      `/warehouse/${this.directory.target.code}/${this.name}/pulls/commits`,
      {
        ...requestData,
      },
    );
    return res.data;
  }
  async PRFiles(requestData: PullRequest) {
    let res = await axios.post(
      `/warehouse/${this.directory.target.code}/${this.name}/pulls/files`,
      {
        ...requestData,
      },
    );
    return res.data;
  }

  async loadNode(reload: boolean = false): Promise<model.WorkNodeModel | undefined> {
    if (this.node === undefined || reload) {
      const res = await kernel.queryWorkNodes({ id: this.id });
      if (res.success) {
        this.node = res.data;
      }
    }
    return this.node;
  }
  async findWork(id: string): Promise<IWork | undefined> {
    await this.loadWorks();
    const find = this.works.find((i) => i.id === id);
    if (find) {
      return find;
    }
  }
  async loadWorks(reload?: boolean | undefined): Promise<IWork[]> {
    if (reload) {
      const res = await kernel.queryWorkDefine({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        if (res.data.result) {
          this.works = res.data.result.map((a) => new Work(a, this));
        } else {
          this.createWork();
        }
      }
    }
    return this.works;
  }
  async createWork(): Promise<IWork | undefined> {
    const data: any = {};
    data.applicationId = this.id;
    data.shareId = this.directory.target.id;
    data.applyAuth = '0';
    data.applyAuths = ['0'];
    data.code = 'pr审批';
    data.name = 'pr审批';
    data.remark = '这是一个自定义的pr审批办事';
    const res = await kernel.createWorkDefine(data);
    if (res.success && res.data.id) {
      let work = new Work(res.data, this);
      work.notify('workReplace', work.metadata);
      this.works.push(work);
      return work;
    }
  }
}
