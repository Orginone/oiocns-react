/**
 * https://github.com/anncwb/vite-plugin-mock/tree/main#readme
 */
import { MockMethod } from 'vite-plugin-mock';

// 列表数据
const list = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export { list };

export default [
  {
    url: '/api/test',
    timeout: 1000,
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: { msg: '测试mock成功', list },
      };
    },
  },
] as MockMethod[];
