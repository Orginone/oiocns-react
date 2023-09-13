import { kernel, model, schema } from '@/ts/base';
import { ITarget, Target } from '../base/target';
import { ICompany } from '../team/company';
import { TargetType } from '../../public/enums';
import { PageAll } from '../../public/consts';
import { ITeam } from '../base/team';
import { targetOperates } from '../../public';
import { ISession } from '../../chat/session';

/** 单位内部机构（部门）接口 */
export interface IDepartment extends ITarget {
  /** 父级部门 */
  parent: IDepartment | undefined;
  /** 子级部门 */
  children: IDepartment[];
  /** 支持的子机构类型 */
  childrenTypes: string[];
  /** 加载子部门 */
  loadChildren(reload?: boolean): Promise<IDepartment[]>;
  /** 设立内部机构 */
  createDepartment(data: model.TargetModel): Promise<IDepartment | undefined>;
}

/** 单位内部机构（部门）实现 */
export class Department extends Target implements IDepartment {
  constructor(_metadata: schema.XTarget, _company: ICompany, parent?: IDepartment) {
    super(_metadata, [_company.id], _company.user);
    this.space = _company;
    this.parent = parent;
    switch (_metadata.typeName as TargetType) {
      case TargetType.College:
        this.childrenTypes = [
          TargetType.Major,
          TargetType.Office,
          TargetType.Working,
          TargetType.Research,
          TargetType.Laboratory,
        ];
        break;
      case TargetType.Section:
      case TargetType.Department:
        this.childrenTypes = [
          TargetType.Office,
          TargetType.Working,
          TargetType.Research,
          TargetType.Laboratory,
        ];
        break;
      case TargetType.Major:
      case TargetType.Research:
      case TargetType.Laboratory:
        this.childrenTypes = [TargetType.Working];
        break;
    }
  }
  space: ICompany;
  parent: IDepartment | undefined;
  children: IDepartment[] = [];
  childrenTypes: string[] = [];
  private _childrenLoaded: boolean = false;
  async loadChildren(reload?: boolean | undefined): Promise<IDepartment[]> {
    if (this.childrenTypes.length > 0 && (!this._childrenLoaded || reload)) {
      const res = await kernel.querySubTargetById({
        id: this.id,
        subTypeNames: this.childrenTypes,
        page: PageAll,
      });
      if (res.success) {
        this._childrenLoaded = true;
        this.children = (res.data.result || []).map(
          (i) => new Department(i, this.space, this),
        );
      }
    }
    return this.children;
  }
  async createDepartment(data: model.TargetModel): Promise<IDepartment | undefined> {
    if (!this.childrenTypes.includes(data.typeName as TargetType)) {
      data.typeName = TargetType.Working;
    }
    data.public = false;
    const metadata = await this.create(data);
    if (metadata) {
      const department = new Department(metadata, this.space, this);
      await department.deepLoad();
      if (await this.pullSubTarget(department)) {
        this.children.push(department);
        return department;
      }
    }
  }
  async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
    return this.createDepartment(data);
  }
  async exit(): Promise<boolean> {
    if (await this.removeMembers([this.user.metadata])) {
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      } else {
        this.space.departments = this.space.departments.filter((i) => i.key != this.key);
      }
      return true;
    }
    return false;
  }
  override async delete(notity: boolean = false): Promise<boolean> {
    notity = await super.delete(notity);
    if (notity) {
      if (this.parent) {
        this.parent.children = this.parent.children.filter((i) => i.key != this.key);
      } else {
        this.space.departments = this.space.departments.filter((i) => i.key != this.key);
      }
    }
    return notity;
  }
  get subTarget(): ITarget[] {
    return this.children;
  }
  get chats(): ISession[] {
    return this.targets.map((i) => i.session);
  }
  get targets(): ITarget[] {
    const targets: ITarget[] = [this];
    for (const item of this.children) {
      targets.push(...item.targets);
    }
    return targets;
  }
  async deepLoad(reload: boolean = false): Promise<void> {
    await Promise.all([
      await this.loadMembers(reload),
      await this.loadChildren(reload),
      await this.directory.loadDirectoryResource(reload),
    ]);
    await Promise.all(
      this.children.map(async (department) => {
        await department.deepLoad(reload);
      }),
    );
  }
  override operates(): model.OperateModel[] {
    const operates = super.operates();
    if (this.hasRelationAuth()) {
      operates.unshift(targetOperates.NewDepartment);
    }
    return operates;
  }
  async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
    if (this.childrenTypes.includes(target.typeName as TargetType)) {
      if (this.children.every((i) => i.id != target.id)) {
        const department = new Department(target, this.space);
        await department.deepLoad();
        this.children.push(department);
        return true;
      }
      return false;
    }
    return await this.pullMembers([target], true);
  }
}
