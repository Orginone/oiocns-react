import { deepClone } from '@/ts/base/common';
import { schemaType } from '@/ts/base/schema';

const UpdataScameItemById = (
  id: string,
  scame: schemaType,
  changeValue: Record<string, any>,
) => {
  let _scame: any = scame;
  const dataObj: Record<string, any> = _scame.properties;
  if (dataObj?.[id]) {
    dataObj[id] = hadnleScameUpdata(dataObj[id], changeValue);
  } else {
    const ObjItems: Record<string, any> = _scame.properties?.object?.properties;
    if (ObjItems?.[id]) {
      ObjItems[id] = hadnleScameUpdata(ObjItems[id], changeValue);
    }
  }

  return _scame;
};

const hadnleScameUpdata = (
  data: { props: Record<string, any> },
  changeValue: Record<string, any>,
) => {
  let newObj: any = deepClone(data);
  const keys = Object.keys(changeValue);
  keys.forEach((key) => {
    switch (key) {
      /* 输入框删除按钮 */
      case 'allowClear':
        {
          const props = newObj?.props ?? {};
          if (changeValue[key] === 'true') {
            props[key] = true;
          } else {
            delete props[key];
          }
          newObj['props'] = props;
        }
        break;

      default:
        {
          if (changeValue[key] === 'true') {
            newObj[key] = true;
          } else if (changeValue[key] === 'false') {
            delete newObj[key];
          } else {
            newObj[key] = changeValue[key];
          }
        }

        break;
    }
  });
  if (newObj.title === '单位名称') {
    console.log('key', newObj);
  }
  return newObj;
};

export { UpdataScameItemById };
