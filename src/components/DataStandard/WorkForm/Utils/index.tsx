import { schema } from '@/ts/base';

export const getWidget = (attribute: schema.XAttribute) => {
  if (attribute.widget) {
    return attribute.widget;
  } else {
    switch (attribute.property!.valueType) {
      case '数值型':
        return '数字框';
      case '描述型':
        return '文本框';
      case '选择型':
        return '选择框';
      case '分类型':
        return '多级选择框';
      case '日期型':
        return '日期选择框';
      case '时间型':
        return '时间选择框';
      case '用户型':
        return '人员搜索框';
      case '附件型':
        return '文件选择框';
      default:
        return '文本框';
    }
  }
};

export const loadwidgetOptions = (attribute: schema.XAttribute) => {
  switch (attribute.property?.valueType) {
    case '数值型':
      return ['数字框'];
    case '描述型':
      return ['文本框', '多行文本框', '富文本框'];
    case '选择型':
      return ['选择框'];
    case '分类型':
      return ['多级选择框'];
    case '日期型':
      return ['日期选择框'];
    case '时间型':
      return ['时间选择框'];
    case '用户型':
      return ['人员搜索框'];
    case '附件型':
      return ['文件选择框'];
    default:
      return ['文本框'];
  }
};
