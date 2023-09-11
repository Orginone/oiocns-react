import { Command } from '@/ts/base';
import Editor, { EditorProps } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';

interface IProps extends EditorProps {
  cmd?: Command;
  style?: CSSProperties;
  onChange?: (value?: string) => void;
}

const defaultProps: IProps = {
  defaultLanguage: 'json',
  options: {
    minimap: {
      enabled: false,
    },
  },
};

export const toJsonString = (value: any): string => {
  const typeName = typeof value;
  console.log(value);
  if (typeName === 'string') {
    return JSON.stringify(JSON.parse(value), null, 2);
  } else if (typeName === 'object') {
    return JSON.stringify(value, null, 2);
  } else if (typeName === 'undefined') {
    return '';
  } else {
    return `${value}`;
  }
};

const MonacoEditor: React.FC<IProps> = (props: IProps) => {
  const div = useRef<HTMLDivElement>(null);
  const editor = useRef<editor.IStandaloneCodeEditor>();

  props = {
    ...defaultProps,
    ...props,
    // automaticLayout 必须关闭，开启会导致无限计算高度，页面卡死
    options: { ...defaultProps.options, ...props.options, automaticLayout: false },
  };

  // 监听父组件 Div 的宽高变化
  const resize = useCallback(() => {
    editor.current?.layout({
      width: div.current?.clientWidth!,
      height: div.current?.clientHeight!,
    });
  }, [div]);

  // 初始化数值
  const setValue = (value: any) => {
    if (value) {
      switch (props.defaultLanguage) {
        case 'json':
          try {
            editor.current?.setValue(toJsonString(value));
            break;
          } catch (error) {
            console.log('initValue error:', error);
          }
        default:
          editor.current?.setValue(value);
      }
    }
  };

  // 监听函数
  useEffect(() => {
    const id = props.cmd?.subscribe((_, cmd, args) => {
      if (cmd == 'onValueChange') {
        setValue(args);
      }
    });
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      props.cmd?.unsubscribe(id!);
    };
  });

  // 渲染
  return (
    <div style={{ ...props.style, height: '100%', width: '100%' }} ref={div}>
      <Editor
        onMount={(e) => {
          editor.current = e;
          resize();
        }}
        onChange={(value) => {
          props.onChange?.apply(props, [value]);
        }}
        {...props}
      />
    </div>
  );
};

export default MonacoEditor;
