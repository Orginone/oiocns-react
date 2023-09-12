import { model } from '@/ts/base';
import { ILink } from '@/ts/core/thing/link';
import { Button, Input, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  current: ILink;
  node: model.RequestNode;
  send: () => void;
}

const InputBox: React.FC<IProps> = ({ current, node, send }) => {
  const [curNode, setCurNode] = useState(node);
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type == 'node' && cmd == 'update') {
        setCurNode({ ...args });
      }
    });
    return () => {
      current.unsubscribe(id);
    };
  });
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        addonBefore={
          <Select
            style={{ width: 100 }}
            value={curNode.data.method}
            options={['GET', 'POST'].map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
            onChange={(value) => {
              node.data.method = value;
              current.updNode(node);
            }}
          />
        }
        size="large"
        value={curNode.data.uri}
        placeholder="输入 URL 地址"
        onChange={(event) => {
          node.data.uri = event.target.value;
          current.updNode(node);
        }}
      />
      <Button onClick={() => send()}>Send</Button>
    </Space.Compact>
  );
};

export default InputBox;
