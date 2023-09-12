import React from 'react';

import CodeMirror from '@uiw/react-codemirror';

interface indexAType {
  onCodeChange: (d: string) => void;
  defaultVal?: { value: string };
}
const Index: React.FC<indexAType> = ({ onCodeChange, defaultVal }) => {
  return (
    <CodeMirror
      value={defaultVal?.value}
      height={'200px'}
      minHeight="100px"
      placeholder="请设置规则内容"
      theme="dark"
      // options={{
      //   theme: 'dark',
      //   tabSize: 2,
      //   mode: { name: 'javaScript' },
      //   line: true,
      //   autofocus: true, //自动获取焦点
      //   styleActiveLine: true, //光标代码高亮
      //   lineNumbers: false, //显示行号
      //   smartIndent: true, //自动缩进
      //   //start-设置支持代码折叠
      //   lineWrapping: true,
      //   foldGutter: true,
      //   extraKeys: {
      //     Ctrl: 'autocomplete',
      //   },
      //   matchBrackets: true, //括号匹配，光标旁边的括号都高亮显示
      //   autoCloseBrackets: true, //键入时将自动关闭()[]{}''""
      // }}
      onChange={(code: string) => {
        onCodeChange(code);
      }}
    />
  );
};

export default Index;
