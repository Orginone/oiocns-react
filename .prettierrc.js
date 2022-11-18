module.exports = {
  // extends: ['prettier', 'prettier/react'],
  semi: true, //是否结尾分号
  trailingComma: 'all', // 结尾处不加逗号 'none'--不加 all--必须加
  printWidth: 90, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2,
  singleQuote: true, //字符串是否使用单引号，默认为false，使用双引号
  endOfLine: 'auto', //避免报错delete (cr)的错
  proseWrap: 'always',
  htmlWhitespaceSensitivity: 'ignore', // 忽略'>'下落问题
  jsxBracketSameLine: true, // 在jsx中把'>' 不单独放一行

  // 在对象文字中打印括号之间的空格。 默认true
  bracketSpacing: true,
  // 箭头函数参数括号 默认avoid 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'always',
  // 在文件顶部插入一个特殊的 @format 标记，指定文件格式需要被格式化。
  insertPragma: false,
};
