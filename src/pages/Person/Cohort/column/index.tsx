// 市场业务
// import { IdPage, Page } from '../typings';
import type { ProColumns, ProFormColumnsType } from '@ant-design/pro-components';
// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据
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
    // width: 'md',
    colProps: { md: 24 },
    columns: [
      {
        // width: 'md',
        name: 'name',
        // initialValue : {item}.item?{item}.item?.name:null,
        // tooltip="最长为 24 位"
        title: '群组名称',
        dataIndex: ['target', 'name'],
        formItemProps: {
          rules: [
            {
              //[^\u4E00-\u9FA5]
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
    // width: 'md',
    colProps: { md: 24 },
    columns: [
      {
        // width: 'md',
        name: 'code',
        // tooltip="最长为 24 位"
        title: '群组编号',
        // initialValue : {item}.item?{item}.item?.code:null,
        dataIndex: ['target', 'code'],
        formItemProps: {
          rules: [
            {
              //[^\u4E00-\u9FA5]
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
    // width: 'md',
    colProps: { md: 24 },
    columns: [
      {
        valueType: 'textarea',
        // width: 'md',
        name: 'remark',
        // initialValue : {item}.item?{item}.item?.remark:null,
        // tooltip="最长为 24 位"
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