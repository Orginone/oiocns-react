export const getResouces = () => {
  const hostname = window.location.hostname;
  if (hostname.startsWith('anxinwu')) {
    return {
      location: 'anxinwu',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省科学技术厅',
      unitPage: 'https://kjt.zj.gov.cn',
    };
  }
  if (hostname.startsWith('gongyicang')) {
    return {
      location: 'gongyicang',
      passport: [1],
      unitName: '浙江省财政厅',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  if (hostname.startsWith('asset')) {
    return {
      location: 'asset',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省财政厅',
      unitPage: 'https://czt.zj.gov.cn',
    };
  }
  if (hostname.startsWith('dataexp')) {
    return {
      location: 'dataexp',
      passport: [1, 2, 3, 4],
      unitName: '杭州电子科技大学',
      unitPage: 'https://www.hdu.edu.cn',
    };
  }
  if (hostname.startsWith('company')) {
    return {
      location: 'company',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省教育厅',
      unitPage: 'https://jyt.zj.gov.cn',
    };
  }
  if (hostname.startsWith('ocia')) {
    return {
      location: 'ocia',
      passport: [1, 2],
      unitName: '杭州电子科技大学',
      unitPage: 'https://www.hdu.edu.cn',
    };
  }
  if (hostname.startsWith('apparatus')) {
    return {
      location: 'apparatus',
      passport: [1, 2, 3, 4, 5],
      unitName: '浙江省科学技术厅',
      unitPage: 'https://kjt.zj.gov.cn',
    };
  }
  return {
    location: 'orginone',
    passport: [1, 2, 3, 4, 5, 6],
    unitName: '',
    unitPage: '',
  };
};
