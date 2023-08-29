export default {
  type: 'object',
  properties: {
    column: {
      title: '整体布局',
      type: 'number',
      enum: [1, 2, 3],
      enumNames: ['一行一列', '一行二列', '一行三列'],
      props: {
        placeholder: '默认一行一列',
      },
    },
    labelWidth: {
      title: '标签宽度',
      type: 'number',
      widget: 'slider',
      max: 300,
      default: 120,
      props: {
        hideNumber: true,
      },
    },
    displayType: {
      title: '标签展示模式',
      type: 'string',
      default: 'row',
      enum: ['row', 'column'],
      enumNames: ['同行', '单独一行'],
      widget: 'radio',
    },
  },
};
