import { ProColumns } from '@ant-design/pro-components';
import { XFormRule } from '@/ts/base/schema';
const FormColumns = (): ProColumns<XFormRule>[] => [
  {
    title: '序号',
    valueType: 'index',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    width: 200,
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '是否启用',
    dataIndex: 'isUsed',
    key: 'isUsed',
    width: 80,
  },
  {
    title: '规则类型',
    dataIndex: 'ruleType',
    width: 80,
    key: 'ruleType',
    valueEnum: {
      method: { text: '函数类型' },
      formula: { text: '公式类型' },
    },
  },
  {
    title: '触发时机',
    dataIndex: 'trigger',
    width: 80,
    key: 'trigger',
    valueEnum: {
      Start: { text: '初始化' }, //首次加载表单时触发
      Running: { text: '运行时' }, //依赖项变更时触发
      Submit: { text: '提交时' }, //表单提交时触发
    },
  },
  {
    title: '备注',
    ellipsis: true,
    key: 'remark',
    width: 200,
    dataIndex: 'remark',
  },
  {
    title: '规则内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    width: 100,
  },
  {
    title: '关联特性',
    dataIndex: 'linkAttrs',
    key: 'linkAttrs',
    width: 160,
    ellipsis: true,
    render: (_text: Array<string> | any, record) => {
      return record['linkAttrs']?.length
        ? record['linkAttrs'].map((v) => v.val).join('/')
        : '--';
    },
  },
  {
    title: '更新时间',
    width: 180,
    dataIndex: 'updateTime',
  },
];

export { FormColumns };
