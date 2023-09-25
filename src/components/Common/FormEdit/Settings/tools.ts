import { deepClone } from '@/ts/base/common';
import { SchemaType } from '@/ts/base/model';

const updateSchemaById = (
  originId: string,
  schema: SchemaType,
  updateValues: Record<string, any>,
) => {
  const idList: string[] = originId?.split('/')?.slice(1);
  const id = idList?.at(-1) as string;
  let property: any = schema;
  let properties: Record<string, object> = schema.properties;
  // debugger;
  for (let i = 0; i < idList.length; i++) {
    const curId = idList[i];
    if (i < idList.length - 1) properties = (properties?.[curId] as any)?.properties;
    property = properties?.[curId];
  }
  properties[id] = updateProperty(property, updateValues);
  return schema;
};

const updateProperty = (property: object, updateValues: Record<string, any>) => {
  let newObj: any = deepClone(property);
  const keys = Object.keys(updateValues);
  keys.forEach((key) => {
    switch (key) {
      /* 输入框删除按钮 */
      case 'allowClear':
        {
          const props = newObj?.props ?? {};
          if (updateValues[key] === 'true') {
            props[key] = true;
          } else {
            delete props[key];
          }
          newObj['props'] = props;
        }
        break;

      default:
        {
          if (updateValues[key] === 'true') {
            newObj[key] = true;
          } else if (updateValues[key] === 'false') {
            delete newObj[key];
          } else {
            newObj[key] = updateValues[key];
          }
        }
        break;
    }
  });
  return newObj;
};

export { updateSchemaById };
