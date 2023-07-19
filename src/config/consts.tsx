export const statusMap = new Map([
  [
    1,
    {
      color: 'blue',
      text: '待处理',
    },
  ],
  [
    100,
    {
      color: 'green',
      text: '已同意',
    },
  ],
  [
    200,
    {
      color: 'red',
      text: '已拒绝',
    },
  ],
  [
    102,
    {
      color: 'green',
      text: '已发货',
    },
  ],
  [
    220,
    {
      color: 'gold',
      text: '买方取消订单',
    },
  ],
  [
    221,
    {
      color: 'volcano',
      text: '卖方取消订单',
    },
  ],
  [
    222,
    {
      color: 'default',
      text: '已退货',
    },
  ],
  [
    240,
    {
      color: 'red',
      text: '已取消',
    },
  ],
]);
