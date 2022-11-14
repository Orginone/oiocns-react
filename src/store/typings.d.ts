import { User, Person, Cohort, Company, WorkSpace, Group, OrgTree } from './../module/org/index';

interface CompanyState {
    company: Company | {}; // 当前单位
    orgTree: OrgTree[]; // 当前单位：创建的部门或工作组树
    groups: Group[]; // 当前单位：创建的集团
    cohorts: Cohort[]; // 当前单位：创建的群组
    persons: Person[]; // 当前单位：所有人员
    setCompany: (company: Company) => void;
    setOrgTree: (orgTree: OrgTree[]) => void;
    setGroups: (groups: Group[]) => void;
    setCohorts: (cohorts: Cohort[]) => void;
    setPersons: (persons: Person[]) => void;
  }

  
interface UserState {
    user: User | {}; // 用户信息
    curWorkSpace: WorkSpace | {};  // 用户当前的工作空间
    workspaces: WorkSpace[]; // 用户工作空间
    fridends: Person[]; // 用户的好友
    cohorts: Cohort[]; // 用户的群组(创建和加入)
    joinedCompanies: Company[]; // 用户加入的公司(单位)
    setUser: (user: User) => void;
    setCurWorkspace: (workspace: WorkSpace) => void;
    setWorkspaces: (workspaces: WorkSpace[]) => void;
    setFriends: (fridends: Person[]) => void;
    setCohorts: (cohorts: Cohort[]) => void;
    setJoinedCompanies: (companies: Company[]) => void;
  }