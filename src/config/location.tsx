interface IResources {
  favicon: string;
  platName: string;
  location: string;
  passport: number[];
  unitName: string;
  unitPage: string;
}
export const getResouces = (): IResources => {
  return {
    platName: '预算管理一体化',
    location: 'budget',
    passport: [1],
    unitName: '浙江省财政厅',
    favicon: '/img/budget.png',
    unitPage: 'https://czt.zj.gov.cn',
  };
};
