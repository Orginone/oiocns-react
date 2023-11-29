import { FC } from 'react';
import { ElementMeta } from './core/ElementMeta';
import { PageBuilderStaticContext } from './core/IViewHost';
import { ElementFC } from './elements/defineElement';

import './common.less';

function scanComponents(): PageBuilderStaticContext<ElementFC> {
  const moduleExports: Dictionary<{ default?: ElementFC }> = import.meta.glob(
    './elements/**/*.tsx',
    { eager: true },
  );

  const elements: Dictionary<ElementFC> = {};
  const metas: Dictionary<ElementMeta> = {};
  let root: FC | null = null;
  for (const [path, _exports] of Object.entries(moduleExports)) {
    if (!_exports.default) {
      console.warn(`模块 ${path} 没有默认导出`);
      continue;
    }
    let name = _exports.default.displayName;
    if (!name) {
      let match = /\/([A-Za-z0-9_])\.tsx$/.exec(path);
      if (!match) {
        console.info(`模块 ${path} 已被跳过`);
        continue;
      }
      console.warn(`组件 ${path} 未定义名称，已默认赋值文件名`);
      name = match[1];
    }
    elements[name] = _exports.default;
    metas[name] = _exports.default.meta;

    if (name == 'Root') {
      root = _exports.default;
    }
  }

  if (!root) {
    throw new Error('Fatal Error: 丢失根元素渲染组件');
  }

  return {
    components: elements,
    metas,
  };
}

export default scanComponents();
