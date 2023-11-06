import { model } from '@/ts/base';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { Dropdown } from 'antd';
import React, { useState } from 'react';

export interface IProps {
  node: model.Request;
}

const Body: React.FC<IProps> = ({ node }) => {
  const [value, setValue] = useState<string>(node.data.content);
  const onChange = (value: string) => {
    setValue(value);
    node.data.content = value ?? '';
  };
  return (
    <Dropdown
      menu={{
        items: [{ key: 'formatter', label: '格式化' }],
        onClick: ({ key }) => {
          switch (key) {
            case 'formatter':
              onChange(JSON.stringify(JSON.parse(value), undefined, 2));
              break;
          }
        },
      }}
      trigger={['contextMenu']}>
      <CodeMirror
        style={{ marginRight: 4 }}
        width={'calc(50vw - 12px)'}
        height={'calc(100vh - 196px)'}
        value={value}
        extensions={[langs.json()]}
        onChange={onChange}
      />
    </Dropdown>
  );
};

export default Body;
