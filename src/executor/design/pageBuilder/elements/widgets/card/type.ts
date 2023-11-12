import { schema } from '@/ts/base';
import { ExistTypeMeta, ParameterInfo } from '../../../core/ElementMeta';
import { DisplayType } from '../position';

export const data: ParameterInfo = {
  label: '数据',
  type: {
    type: 'type',
    label: '实体',
    typeName: 'thing',
  } as ExistTypeMeta<schema.XThing | undefined>,
};

export const label: ParameterInfo = {
  label: '位置名称',
  type: { type: 'string' },
};

export const valueType: ParameterInfo = {
  label: '展示类型',
  type: { type: 'type' } as ExistTypeMeta<DisplayType>,
};

export const length: ParameterInfo = {
  label: '长度',
  type: { type: 'type' } as ExistTypeMeta<number | undefined>,
};

export const hasPrefix: ParameterInfo = {
  label: '是否有字段名前缀',
  type: { type: 'type' } as ExistTypeMeta<boolean | undefined>,
};

export const hasTip: ParameterInfo = {
  label: '是否有字段名前缀',
  type: { type: 'type' } as ExistTypeMeta<boolean | undefined>,
};
