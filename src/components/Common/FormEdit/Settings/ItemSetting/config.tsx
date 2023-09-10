import { loadRegexpOpts, loadWidgetsOpts } from '../rule';
const BoolEnum = {
  true: { text: '是' },
  false: { text: '否' },
};
const flexEnum = {
  collapse: { text: '平铺' },
  flex: { text: '弹性' },
  card: { text: '卡片' },
};

const columns: any = (type: string) => {
  return [
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '标题',
      dataIndex: 'name',
      valueType: 'text',
      tooltip: '',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '标签宽度',
      width: '100%',
      dataIndex: 'labelWidth',
      valueType: 'digit',
      tooltip: '',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '编号',
      dataIndex: 'code',
      valueType: 'text',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '组件',
      dataIndex: 'widget',
      valueType: 'select',
      fieldProps: { options: loadWidgetsOpts(type) },
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '输入提示',
      dataIndex: 'placeholder',
      valueType: 'text',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '必填',
      dataIndex: 'required',
      valueType: 'radioButton',
      initialValue: 'false',
      valueEnum: BoolEnum,
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '只读',
      dataIndex: 'readOnly',
      initialValue: false,
      valueType: 'radio',
      valueEnum: BoolEnum,
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '隐藏',
      dataIndex: 'hidden',
      initialValue: 'false',
      valueType: 'radioButton',
      valueEnum: BoolEnum,
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '是否带清除按钮',
      dataIndex: 'allowClear',
      valueType: 'radio',
      valueEnum: BoolEnum,
    },

    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '最小值',
      dataIndex: 'min',
      width: '100%',
      valueType: 'digit',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '最大值',
      dataIndex: 'max',
      width: '100%',
      valueType: 'digit',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '最少字数',
      width: '100%',
      dataIndex: 'minLength',
      valueType: 'digit',
    },
    {
      colProps: {
        xs: 12,
        md: 12,
      },
      title: '最大字数',
      width: '100%',
      dataIndex: 'maxLength',
      valueType: 'digit',
    },

    {
      colProps: { span: 24 },
      title: '特性定义',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      colProps: { span: 24 },
      title: '正则校验',
      dataIndex: 'rules',
      tooltip: '示例：^[A-Za-z0-9]+$',
      valueType: 'select',
      fieldProps: { options: loadRegexpOpts(type) },
    },
  ];
};

const ObjectColumns = [
  {
    colProps: {
      xs: 12,
      md: 12,
    },
    title: '主题',
    dataIndex: 'theme',
    valueType: 'radio',
    valueEnum: flexEnum,
  },
  {
    valueType: 'dependency',
    name: ['theme'],
    columns: ({ theme }: any) => {
      if (theme === 'flex') {
        return [
          {
            title: '高度',
            dataIndex: 'height',
            valueType: 'text',
          },
          {
            title: '布局方向(flex-direction)',
            dataIndex: 'flexDirection',
            valueType: 'select',
            fieldProps: {
              options: [
                { label: '横向', value: 'row' },
                { label: '横向反转', value: 'row-reverse' },
                { label: '纵向', value: 'column' },
                { label: '纵向反转', value: 'column-reverse' },
              ],
            },
          },
          {
            title: '换行方式(flex-wrap)',
            dataIndex: 'flexWrap',
            valueType: 'select',
            fieldProps: {
              options: [
                { label: '换行', value: 'wrap' },
                { label: '不换行', value: 'nowrap' },
                { label: '反向换行', value: 'wrap-reverse' },
              ],
            },
          },
          {
            title: '对齐方式(justify-content)',
            dataIndex: 'justifyContent',
            valueType: 'select',
            fieldProps: {
              options: [
                { label: '起点对齐', value: 'flex-start' },
                { label: '终点对齐', value: 'flex-end' },
                { label: '居中对齐', value: 'center' },
                { label: '两端对齐', value: 'space-between' },
                { label: '相同间距', value: 'space-around' },
              ],
            },
          },
          {
            title: '轴对齐方式(align-items)',
            dataIndex: 'alignItems',
            valueType: 'select',
            fieldProps: {
              options: [
                { label: '起点对齐', value: 'flex-start' },
                { label: '终点对齐', value: 'flex-end' },
                { label: '居中对齐', value: 'center' },
                { label: '基线对齐', value: 'baseline' },
                { label: '拉伸铺满', value: 'stretch' },
              ],
            },
          },
          {
            title: '多轴线对齐(align-content)',
            dataIndex: 'alignContent',
            valueType: 'select',
            fieldProps: {
              options: [
                { label: '起点对齐', value: 'flex-start' },
                { label: '终点对齐', value: 'flex-end' },
                { label: '居中对齐', value: 'center' },
                { label: '两端对齐', value: 'space-between' },
                { label: '相同间距', value: 'space-around' },
                { label: '拉伸铺满', value: 'stretch' },
              ],
            },
          },
        ];
      } else {
        return [
          {
            title: '背景',
            dataIndex: 'background',
            valueType: 'text',
            widget: 'color',
          },
          {
            title: '外边距',
            dataIndex: 'margin',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '内边距',
            dataIndex: 'padding',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '边框宽',
            dataIndex: 'border-width',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '边框样式',
            dataIndex: 'borderStyle',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '边框颜色',
            dataIndex: 'borderColor',
            valueType: 'text',
            widget: 'color',
          },
          {
            title: '圆角',
            dataIndex: 'borderRadius',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '弹性伸缩',
            dataIndex: 'flex',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '排列顺序',
            dataIndex: 'order',
            valueType: 'text',
            widget: 'input',
          },
          {
            title: '自身对齐',
            dataIndex: 'alignSelf',
            valueType: 'text',
            widget: 'input',
          },
        ];
      }
    },
  },
];

const getDefaultCommonSettings = (valueType?: string) => {
  if (!valueType) {
    return ObjectColumns;
  }
  return columns(valueType);
};
export { getDefaultCommonSettings };
