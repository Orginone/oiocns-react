import { ITransfer } from '@/ts/core';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import cls from './../../index.module.less';

interface IProps {
  current: ITransfer;
}

const getOptions = (current: ITransfer) => {
  return current.metadata.envs.map((item) => {
    return {
      value: item.id,
      label: (
        <Space>
          {item.name}
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              current.delEnv(item.id);
            }}
          />
          <EditOutlined
            onClick={(e) => {
              e.stopPropagation();
              current.command.emitter('tools', 'updateEnvironment', item);
            }}
          />
        </Space>
      ),
    };
  });
};

const GraphTools: React.FC<IProps> = ({ current }) => {
  const [curEnv, setCurEnv] = useState<string | undefined>(current.metadata.curEnv);
  const [options, setOptions] = useState<DefaultOptionType[]>(getOptions(current));
  useEffect(() => {
    const id = current.command.subscribe((type, cmd) => {
      if (type != 'environments') return;
      switch (cmd) {
        case 'refresh':
          console.log(current, current.metadata.curEnv);
          setOptions(getOptions(current));
          setCurEnv(current.metadata.curEnv);
          break;
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return (
    <Space className={cls.tools}>
      <Button onClick={() => current.command.emitter('graph', 'executing')}>运行</Button>
      <Button onClick={() => current.command.emitter('graph', 'center')}>中心</Button>
      <Button onClick={() => current.command.emitter('tools', 'newEnvironment')}>
        新增环境
      </Button>
      <Select
        placeholder="选择运行环境"
        style={{ minWidth: 100 }}
        value={curEnv}
        onChange={(value) => current.changeEnv(value)}
        options={options}>
        中心
      </Select>
    </Space>
  );
};

export default GraphTools;
