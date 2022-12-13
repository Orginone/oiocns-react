import type { ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
type DataItem = {
  name: string;
  state: string;
};
export const cohortColumn: ProColumns<any>[] = [
  {
    title: '序号',
    fixed: 'left',
    dataIndex: 'index',
    width: 50,
    render: (_key: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '群组名称',
    dataIndex: ['target', 'name'],
  },
  {
    title: '群组编号',
    dataIndex: ['target', 'code'],
  },
  {
    title: '群组简介',
    dataIndex: ['target', 'team', 'remark'],
  },
  {
    title: '归属',
    dataIndex: ['target', 'belongId'],
  },
];

export const updateColumn: ProFormColumnsType<DataItem>[] = [
  {
    valueType: 'group',
    colProps: { md: 24 },
    columns: [
      {
        name: 'name',
        title: '群组名称',
        dataIndex: ['target', 'name'],
        formItemProps: {
          rules: [
            {
              pattern: /^[\u4e00-\u9fa5]{2,6}$/,
              message: '群组内容只能为长度2-6的中文',
              validateTrigger: 'onBlur',
            },
            { required: true, message: '请输入群组名称' },
          ],
        },
      },
    ],
  },
  {
    valueType: 'group',
    colProps: { md: 24 },
    columns: [
      {
        name: 'code',
        title: '群组编号',
        dataIndex: ['target', 'code'],
        formItemProps: {
          rules: [
            {
              pattern: /^[a-zA-Z]+$/,
              message: '群组编号为英文字符组成',
              validateTrigger: 'onBlur',
            },
            { required: true, message: '群组编号不能为空' },
            { message: '请输入长度为2-10字符的群组编号', min: 2, max: 20 },
          ],
        },
      },
    ],
  },
  {
    valueType: 'group',
    colProps: { md: 24 },
    columns: [
      {
        valueType: 'textarea',
        name: 'remark',
        title: '群组简介',
        dataIndex: ['target', 'team', 'remark'],
        formItemProps: {
          rules: [
            { required: true, message: '请输入群组简介' },
            { message: '群组简介内容不能超过200字符', max: 200 },
          ],
        },
      },
    ],
  },
];
