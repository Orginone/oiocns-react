import { schema } from '@/ts/base';

export const getWidget = (valueType?: string, widget?: string) => {
  if (widget) {
    return widget;
  } else {
    switch (valueType) {
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
      return [
        '操作人',
        '操作组织',
        '成员选择框',
        '内部机构选择框',
        '人员搜索框',
        '单位搜索框',
        '组织群搜索框',
        '群组搜索框',
      ];
    case '附件型':
      return ['文件选择框'];
    case '引用型':
      return ['文本框', '引用选择框'];
    default:
      return ['文本框'];
  }
};

export const getItemNums = () => {
  return ['一列', '二列', '三列', '四列', '五列', '六列', '七列', '八列'];
};

export const getItemWidth = (numStr: string) => {
  switch (numStr) {
    case '一列':
      return '100%';
    case '二列':
      return 'calc(50% - 5px)';
    case '三列':
      return 'calc(33.333% - 7px)';
    case '四列':
      return 'calc(25% - 8px)';
    case '五列':
      return 'calc(20% - 8px)';
    case '六列':
      return 'calc(16.63% - 8px)';
    case '七列':
      return 'calc(14.24% - 8px)';
    case '八列':
      return 'calc(12.45% - 8px)';
    default:
      return 300;
  }
};
