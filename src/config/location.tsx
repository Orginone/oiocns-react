interface IResources {
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
      location: 'anxinwu',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省科学技术厅',
      unitPage: 'https://kjt.zj.gov.cn',
    };
  }
  //公益仓
  if (hostname.startsWith('gongyicang')) {
    return {
      location: 'gongyicang',
      passport: [],
      unitName: '浙江省财政厅',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  //资产共享云
  if (hostname.startsWith('asset')) {
    return {
      location: 'asset',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省财政厅',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  //数据资产治理实验平台
  if (hostname.startsWith('dataexp')) {
    return {
      location: 'dataexp',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省财政厅',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  //浙江省校属企业监管平台
  if (hostname.startsWith('company')) {
    return {
      location: 'company',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省教育厅',
      unitPage: 'https://jyt.zj.gov.cn',
    };
  }
  //资产云开放协同创新中心
  if (hostname.startsWith('ocia')) {
    return {
      location: 'ocia',
      passport: [1, 2],
      unitName: '杭州电子科技大学',
      unitPage: 'https://www.hdu.edu.cn',
    };
  }
  //科研大仪共享平台
  if (hostname.startsWith('apparatus')) {
    return {
      location: 'apparatus',
      passport: [1, 2, 3, 4, 5, 6],
      unitName: '浙江省科学技术厅',
      unitPage: 'https://kjt.zj.gov.cn',
    };
  }
  //奥集能
  return {
    location: 'orginone',
    passport: [1, 2, 3, 4, 5, 6],
    unitName: '',
    unitPage: '',
  };
};
