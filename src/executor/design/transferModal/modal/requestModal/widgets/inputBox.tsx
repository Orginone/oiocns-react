import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Button, Input, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { toUrlParams } from './httpData/params';
import { EnvSelector } from '../../../';

interface IProps {
  transfer: ITransfer;
  current: model.Request;
  send: () => void;
}

const InputBox: React.FC<IProps> = ({ transfer, current, send }) => {
  const [method, setMethod] = useState(current.data.method);
  const [uri, setUri] = useState(current.data.uri);
  useEffect(() => {
    const id = transfer.command.subscribe((type, cmd, args) => {
      if (type == 'node') {
        switch (cmd) {
          case 'method':
            setMethod(args);
            break;
          case 'uri':
            setUri(args);
            break;
          case 'params':
            setUri(toUrlParams(uri, args));
            break;
        }
      }
    });
    return () => {
      transfer.unsubscribe(id);
    };
  });
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        addonBefore={
          <Select
            style={{ width: 100 }}
            value={method}
            options={['GET', 'POST'].map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
            onChange={(value) => {
              current.data.method = value;
              transfer.command.emitter('node', 'method', value);
            }}
          />
        }
        value={uri}
        size="large"
        placeholder="输入 URL 地址"
        onChange={(event) => {
          current.data.uri = event.target.value;
          transfer.command.emitter('node', 'uri', event.target.value);
        }}
      />
      <EnvSelector current={transfer} />
      <Button onClick={() => send()}>Send</Button>
    </Space.Compact>
  );
};

export default InputBox;
