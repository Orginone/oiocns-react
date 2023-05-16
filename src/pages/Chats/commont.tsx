export const flatten = (arr) => {
  return arr.reduce((result, item) => {
    return result.concat(
      item,
      Array.isArray(item.children) ? flatten(item.children) : [],
    );
  }, []);
};
