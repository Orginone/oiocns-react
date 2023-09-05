import { IRequest } from '@/ts/core/thing/config';
import { AiOutlineDown } from '@/icons/ai'
import { Dropdown, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Param } from './request/widgets/params';
import { generateUuid } from '@/ts/base/common';

interface IProps {
  current: IRequest;
  send: () => void;
}

const toParams = (value?: string): Param[] => {
  if (value) {
    let mark = value.indexOf('?');
    if (mark != -1) {
      let params = value.substring(mark + 1);
      let groups = params.split('&');
      let data: Param[] = [];
      for (let group of groups) {
        let split = group.split('=', 2);
        data.push({
          id: generateUuid(),
          key: split[0],
          value: split.length > 1 ? split[1] : '',
        });
      }
      return data;
    }
  }
  return [];
};

const InputBox: React.FC<IProps> = ({ current, send }) => {
  const [url, setUrl] = useState<string | undefined>(current.axios.url);
  const [method, setMethod] = useState<string>(current.axios.method ?? 'GET');
  useEffect(() => {
    const id = current.subscribe(() => {
      setUrl(current.axios.url);
      setMethod(current.axios.method ?? 'GET');
    });
    return () => {
      current.unsubscribe(id);
    };
  });
  return (
    <Input
      addonBefore={
        <Dropdown
          menu={{
            items: ['GET', 'POST'].map((item) => {
              return {
                key: item,
                label: item,
              };
            }),
            onClick: (info) => {
              current.metadata.axios.method = info.key;
              current.refresh(current.metadata);
            },
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Space style={{ width: 80, userSelect: 'none' }}>{method}</Space>
            <AiOutlineDown />
          </div>
        </Dropdown>
      }
      addonAfter={
        <Space
          style={{
            width: 60,
            display: 'flex',
            justifyContent: 'center',
            userSelect: 'none',
          }}
          onClick={() => send()}>
          Send
        </Space>
      }
      size='large'
      value={url}
      placeholder="输入 URL 地址"
      onChange={(event) => {
        current.metadata.axios.url = event.target.value;
        current.metadata.params = toParams(event.target.value);
        current.refresh(current.metadata);
      }}
    />
  );
};

export default InputBox;
