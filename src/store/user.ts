import create from 'zustand';
import { User, Person, Cohort, Company, WorkSpace } from './../module/org/index';
import { UserState } from './typings';

/**
 * 状态管理-用户信息
 */
const useUserStore = create<UserState>((set) => ({
  user: {}, // 用户信息
  curWorkSpace: {}, // 当前工作空间
  workspaces: [], // 用户工作空间列表
  fridends: [], // 用户的好友
  cohorts: [], // 用户的群组(创建和加入)
  joinedCompanies: [], // 用户加入的公司(单位)
  setUser: (user: User) => set({ user }),
  setCurWorkspace: (workspace: WorkSpace) => set({ curWorkSpace: workspace }),
  setWorkspaces: (workspaces: WorkSpace[]) => set({ workspaces }),
  setFriends: (fridends: Person[]) => set({ fridends }),
  setCohorts: (cohorts: Cohort[]) => set({ cohorts }),
  setJoinedCompanies: (companies: Company[]) => set({ joinedCompanies: companies }),
}));

export default useUserStore;
