import { loadWidgetsOpts } from '../FormDesign/schemaRule2.js';

function getDefaultCommonSettings(e: any) {
  const defaultCommonSettings = {
    title: {
      title: '标题',
      type: 'string',
      widget: 'htmlInput',
    },
    widget: {
      title: '组件',
      type: 'string',
      enum: loadWidgetsOpts(e!.valueType).map((item) => {
        return item.value;
      }),
      enumNames: loadWidgetsOpts(e!.valueType).map((item) => {
        return item.label;
      }),
      widget: 'select',
    },
    displayType: {
      title: '标题展示模式',
      type: 'string',
      enum: ['row', 'column'],
      enumNames: ['同行', '单独一行'],
      widget: 'radio',
    },
    default: {
      title: '默认值',
      type: 'string',
    },
    required: {
      title: '必填',
      type: 'boolean',
    },
    // placeholder: {
    //   title: '占位符',
    //   type: 'string',
    // },
    // min: {
    //   title: '最小值',
    //   type: 'number',
    // },
    // max: {
    //   title: '最大值',
    //   type: 'number',
    // },
    disabled: {
      title: '禁用',
      type: 'boolean',
    },
    readOnly: {
      title: '只读',
      type: 'boolean',
    },
    hidden: {
      title: '隐藏',
      type: 'boolean',
    },
    width: {
      title: '元素宽度',
      type: 'string',
      widget: 'percentSlider',
    },
    labelWidth: {
      title: '标签宽度',
      description: '默认值120',
      type: 'number',
      widget: 'slider',
      max: 400,
      props: {
        hideNumber: true,
      },
    },
  };
  return defaultCommonSettings;
}

export default getDefaultCommonSettings;
