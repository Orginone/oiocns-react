import { model } from '@/ts/base';

type Field = 'info' | 'code';

export const getMappingField = (mappingType: model.MappingType) => {
  let sourceField: Field = 'code';
  let targetField: Field = 'code';
  switch (mappingType) {
    case 'OToI':
      sourceField = 'info';
      targetField = 'code';
      break;
    case 'IToI':
      sourceField = 'code';
      targetField = 'code';
      break;
    case 'IToO':
      sourceField = 'code';
      targetField = 'info';
      break;
    case 'OToO':
      sourceField = 'info';
      targetField = 'info';
      break;
  }
  return { sourceField, targetField };
};
