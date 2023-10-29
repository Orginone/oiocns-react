export const getResouces = () => {
  const hostname = window.location.hostname;
  if (hostname.startsWith('anxinwu')) {
    return {
      location: 'anxinwu',
      passport: [1, 2, 3, 4, 5],
    };
  }
  if (hostname.startsWith('gongyicang')) {
    return {
      location: 'gongyicang',
      passport: [1],
    };
  }
  if (hostname.startsWith('asset')) {
    return {
      location: 'asset',
      passport: [1, 2, 3, 4, 5],
    };
  }
  if (hostname.startsWith('dataexp')) {
    return {
      location: 'dataexp',
      passport: [1, 2, 3, 4],
    };
  }
  if (hostname.startsWith('company')) {
    return {
      location: 'company',
      passport: [1, 2, 3, 4, 5],
    };
  }
  if (hostname.startsWith('ocia')) {
    return {
      location: 'ocia',
      passport: [1, 2],
    };
  }
  if (hostname.startsWith('apparatus')) {
    return {
      location: 'apparatus',
      passport: [1, 2, 3, 4, 5],
    };
  }
  return {
    location: 'orginone',
    passport: [1, 2, 3, 4, 5, 6],
  };
};
