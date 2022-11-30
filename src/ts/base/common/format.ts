const sizeUnits = ['', 'KB', 'MB', 'GB', 'TB', 'PB'];
/**
 * 格式化大小
 * @param size 大小
 */
export function formatSize(size: number, unit: string = ''): string {
  if (size > 1024) {
    const index = sizeUnits.indexOf(unit);
    if (index + 2 < sizeUnits.length) {
      return formatSize(parseInt((size / 1024.0).toFixed(0)), sizeUnits[index + 1]);
    }
  }
  return size + unit;
}
