import { generateUuid } from '@/ts/base/common';
import { IRequest } from '@/ts/core/thing/config';
import { AiOutlineDown } from '@/icons/ai'
import { Button, Input, Select, Space, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { Param } from './request/widgets/params';
import { expand, loadEnvironmentsMenu } from '../..';

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
  const [envId, setEnvId] = useState<string | undefined>(current.metadata.envId);
  const [url, setUrl] = useState<string | undefined>(current.axios.url);
  const [method, setMethod] = useState<string>(current.axios.method ?? 'GET');
  const treeData = [loadEnvironmentsMenu(current.directory.target.directory)];
  useEffect(() => {
    const id = current.subscribe(() => {
      setEnvId(current.metadata.envId);
      setUrl(current.axios.url);
      setMethod(current.axios.method ?? 'GET');
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
            value={method}
            options={['GET', 'POST'].map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
            onChange={(value) => {
              current.metadata.axios.method = value;
              current.refresh(current.metadata);
            }}
          />
        }
        size="large"
        value={url}
        placeholder="输入 URL 地址"
        onChange={(event) => {
          current.metadata.axios.url = event.target.value;
          current.metadata.params = toParams(event.target.value);
          current.refresh(current.metadata);
        }}
      />
      <TreeSelect
        value={envId}
        fieldNames={{
          label: 'label',
          value: 'key',
          children: 'children',
        }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto', minWidth: 300 }}
        treeData={treeData}
        treeDefaultExpandedKeys={expand(treeData, '环境')}
        placement="bottomRight"
        onSelect={(value) => {
          current.metadata.envId = value;
          current.refresh(current.metadata);
        }}
      />
      <Button onClick={() => send()}>
        Send
      </Button>
    </Space.Compact>
  );
};

export default InputBox;
