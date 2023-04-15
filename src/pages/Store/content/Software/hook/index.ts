const timestampToDate=(timestamp:any)=> { //时间戳转日期
  const date = new Date(timestamp * 1000); // 将10位的时间戳转换为毫秒数
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth()方法返回的是0~11，需要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const dateFormat = `${year}-${month < 10 ? '0' + month : month}-${
    day < 10 ? '0' + day : day
  } ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  return dateFormat;
  }
  export {timestampToDate}