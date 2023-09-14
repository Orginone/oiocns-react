import { ITransfer } from '@/ts/core';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import cls from './../../index.module.less';
import { model } from '@/ts/base';

interface IProps {
  current: ITransfer;
}

const GraphTools: React.FC<IProps> = ({ current }) => {
  const [status, setStatus] = useState<model.GraphStatus>(current.status);
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type == 'graph' && cmd == 'status') {
        setStatus(args);
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return (
    <Space className={cls.tools}>
      <Button onClick={() => current.command.emitter('graph', 'center')}>中心</Button>
      <Button
        disabled={status == 'Running'}
        onClick={() => current.command.emitter('graph', 'executing')}>
        运行
      </Button>
      <Button
        disabled={status != 'Editable'}
        onClick={() => current.command.emitter('tools', 'newEnvironment')}>
        新增环境
      </Button>
      <EnvSelector current={current} />
    </Space>
  );
};

export const EnvSelector: React.FC<IProps> = ({ current }) => {
  const getOptions = (current: ITransfer) => {
    return current.metadata.envs.map((item) => {
      return {
        value: item.id,
        label: (
          <Space>
            {item.name}
            {status != 'Editable' && (
              <CloseOutlined
                onClick={(e) => {
                  e.preventDefault();
                  current.delEnv(item.id);
                }}
              />
            )}
            {status != 'Editable' && (
              <EditOutlined
                onClick={(e) => {
                  e.preventDefault();
                  current.command.emitter('tools', 'updateEnvironment', item);
                }}
              />
            )}
          </Space>
        ),
      };
    });
  };
  const [status, setStatus] = useState<model.GraphStatus>(current.status);
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
      placeholder="选择运行环境"
      value={curEnv}
      onChange={(value) => current.changeEnv(value)}
      options={options}
    />
  );
};

export default GraphTools;
