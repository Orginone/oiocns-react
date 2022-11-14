import create from 'zustand';
import { Company, Group, Cohort, OrgTree, Person } from './../module/org/index';
import { CompanyState } from './typings';

/**
 * 状态管理-当前单位
 */
const useCompanyStore = create<CompanyState>((set) => ({
  company: {}, // 当前单位
  orgTree: [], // 当前单位：创建的部门或工作组树
  groups: [], // 当前单位：创建的集团
  cohorts: [], // 当前单位：创建的群组
  persons: [], // 当前单位：所有人员
  setCompany: (company: Company) => set({ company }),
  setOrgTree: (orgTree: OrgTree[]) => set({ orgTree }),
  setGroups: (groups: Group[]) => set({ groups }),
  setCohorts: (cohorts: Cohort[]) => set({ cohorts }),
  setPersons: (persons: Person[]) => set({ persons }),
}));

export default useCompanyStore;
