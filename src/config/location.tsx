interface IResources {
  favicon: string;
  platName: string;
  location: string;
  passport: number[];
  unitName: string;
  unitPage: string;
}
export const getResouces = (): IResources => {
  const hostname = window.location.hostname;
  //安心屋
  if (hostname.startsWith('anxinwu')) {
    return {
      platName: '安心屋',
      location: 'anxinwu',
      passport: [6],
      unitName: '浙江省科学技术厅',
      favicon: '/favicon/anxinwu.ico',
      unitPage: 'https://kjt.zj.gov.cn',
    };
  }
  //公益仓
  if (hostname.startsWith('gongyicang')) {
    return {
      platName: '公益仓',
      location: 'gongyicang',
      passport: [],
      unitName: '浙江省财政厅',
      favicon: '/favicon/gongyicang.ico',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  //资产共享云
  if (hostname.startsWith('asset')) {
    return {
      platName: '资产共享云',
      location: 'asset',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省财政厅',
      favicon: '/favicon/asset.ico',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  //数据资产治理实验平台
  if (hostname.startsWith('dataexp')) {
    return {
      platName: '数据资产治理实验平台',
      location: 'dataexp',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省财政厅',
      favicon: '/favicon/dataexp.ico',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  //浙江省校属企业监管平台
  if (hostname.startsWith('company')) {
    return {
      platName: '浙江省校属企业监管平台',
      location: 'company',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省教育厅',
      favicon: '/favicon/company.ico',
      unitPage: 'https://jyt.zj.gov.cn',
    };
  }
  //资产云开放协同创新中心
  if (hostname.startsWith('ocia')) {
    return {
      platName: '资产云开放协同创新中心',
      location: 'ocia',
      passport: [1, 2],
      unitName: '杭州电子科技大学',
      favicon: '/favicon/ocia.ico',
      unitPage: 'https://www.hdu.edu.cn',
    };
  }
  //科研大仪共享平台
  if (hostname.startsWith('apparatus')) {
    return {
      platName: '科研大仪共享平台',
      location: 'apparatus',
      passport: [1, 2, 3, 4, 5, 6],
      unitName: '浙江省科学技术厅',
      favicon: '/favicon/apparatus.ico',
      unitPage: 'https://kjt.zj.gov.cn',
    };
  }
  //奥集能
  return {
    platName: '奥集能',
    location: 'orginone',
    passport: [1, 2, 3, 4, 5, 6],
    unitName: '',
    unitPage: '',
    favicon: '/favicon/orginone.ico',
  };
};
