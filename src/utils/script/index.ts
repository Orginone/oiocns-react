import * as Babel from '@babel/standalone';
import type { TransformOptions } from '@babel/core';

function  getBaseOptions(): TransformOptions {
  return {
    parserOpts: {
      plugins: [
        'typescript',
        'jsx',
      ]
    },
    presets: [
      [
        Babel.availablePresets['typescript'], {}
      ],
    ],
    ast: true,
  };
}

/**
 * 校验并转换js/ts代码
 * @param code 代码
 */
export function transform(code: string) {
  try {
    const result = Babel.transform(code, {
      ...getBaseOptions(),
      filename: '表达式'
    });
    return {
      code: result.code!,
      ast: result.ast!,
    };
  } catch (error: any) {
    throw new SyntaxError('语法错误：' + error.message, { cause: error });
  }
}

/**
 * 校验并转换js/ts表达式
 * @param expression 表达式
 */
export function transformExpression(expression: string) {
  const result = transform(expression);
  const body = result.ast.program.body;

  if (body.length == 0) {
    throw new SyntaxError('内容为空');
  }
  if (body.length > 1) {
    throw new SyntaxError('只允许包含一条语句');
  }
  const es = body[0];
  if (es.type != 'ExpressionStatement') {
    throw new SyntaxError('语句不是表达式');
  }
  return result;

}