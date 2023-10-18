import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Space, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useState, useEffect } from 'react';

interface IProps {
  current: ITransfer;
}

export const EnvSelector: React.FC<IProps> = ({ current }) => {
  const getOptions = (current: ITransfer) => {
    return current.metadata.envs.map((item) => {
      return {
        value: item.id,
        label: (
          <Space key={item.id}>
            {item.name}
            <CloseOutlined
              onClick={(e) => {
                e.preventDefault();
                current.metadata.envs = current.envs.filter((env) => env.id != item.id);
                current.metadata.curEnv = undefined;
                current.command.emitter('environments', 'refresh');
              }}
            />
            <EditOutlined
              onClick={(e) => {
                e.preventDefault();
                current.command.emitter('tools', 'updateEnvironment', item);
              }}
            />
          </Space>
        ),
      };
    });
  };
  const [status, setStatus] = useState<model.GStatus>('Editable');
  const [curEnv, setCurEnv] = useState<string | undefined>(current.metadata.curEnv);
  const [options, setOptions] = useState<DefaultOptionType[]>(getOptions(current));
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      switch (type) {
        case 'environments':
          switch (cmd) {
            case 'refresh':
              setOptions(getOptions(current));
              setCurEnv(current.metadata.curEnv);
              break;
          }
          break;
        case 'graph':
          switch (cmd) {
            case 'status':
              setStatus(args);
              setOptions(getOptions(current));
              break;
          }
          break;
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return (
    <Select
      disabled={status == 'Running'}
      placeholder="选择运行环境"
      value={curEnv}
      onChange={(value) => {
        current.metadata.curEnv = value;
        current.command.emitter('environments', 'refresh');
      }}
      options={options}
    />
  );
};
