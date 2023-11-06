/**
 * 代码仓库时间处理函数
 */
function getTimeAgo(timestamp: any) {
  const currentDate = new Date();
  const pastDate = new Date(timestamp);

  const millisecondsDiff = currentDate.getTime() - pastDate.getTime();
  const secondsDiff = Math.floor(millisecondsDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);
  const monthsDiff = Math.floor(daysDiff / 30);
  const yearsDiff = Math.floor(monthsDiff / 12);

  if (yearsDiff > 0) {
    return yearsDiff === 1 ? '1年前' : `${yearsDiff}年前`;
  } else if (monthsDiff > 0) {
    return monthsDiff === 1 ? '1个月前' : `${monthsDiff}个月前`;
  } else if (daysDiff > 0) {
    return daysDiff === 1 ? '1天前' : `${daysDiff}天前`;
  } else if (hoursDiff > 0) {
    return hoursDiff === 1 ? '1小时前' : `${hoursDiff}小时前`;
  } else if (minutesDiff > 0) {
    return minutesDiff === 1 ? '1分钟前' : `${minutesDiff}分钟前`;
  } else {
    return '刚刚';
  }
}
export { getTimeAgo };
