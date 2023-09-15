import { ITransfer } from '@/ts/core';
import { Modal } from 'antd';
import React from 'react';
import { useState, useEffect } from 'react';
import * as forms from '../../forms';
import { generateUuid } from '@/ts/base/common';

interface IProps {
  current: ITransfer;
}

const NodeForms: React.FC<IProps> = ({ current }) => {
  const [entities, setEntities] = useState<{ [key: string]: any }>({});
  const [commands, setCommands] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type != 'tools') return;
      switch (cmd) {
        case 'newEnvironment':
          setEntities({ ...entities, [current.id]: undefined });
          setCommands({ ...commands, [current.id]: cmd });
          break;
        case 'updateEnvironment':
          console.log(args);
          setEntities({ ...entities, [args.id]: args });
          setCommands({ ...commands, [args.id]: cmd });
          break;
        case 'update': {
          setEntities({ ...entities, [args.id]: args });
          let mapping: { [key: string]: string } = {
            请求: 'updateRequest',
            脚本: 'updateExecutable',
            映射: 'updateMapping',
            选择: 'updateSelection',
            环境: 'updateEnvironment',
            存储: 'updateStore',
            事项配置: 'updateWorkConfig',
            实体配置: 'updateThingConfig',
          };
          setCommands({ ...commands, [args.id]: mapping[args.typeName] });
          break;
        }
        case 'copy': {
          const { entity } = args;
          Modal.confirm({
            title: '确认复制吗',
            onOk: async () => {
              finished();
            },
            okText: '确认',
            cancelText: '取消',
          });
          break;
        }
        case 'delete': {
          const { entity } = args;
          Modal.confirm({
            title: '确认删除吗',
            onOk: async () => {
              finished();
            },
            okText: '确认',
            cancelText: '取消',
          });
          break;
        }
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  const finished = (id?: string) => {
    if (id) {
      delete entities[id];
      delete commands[id];
      setEntities({ ...entities });
      setCommands({ ...commands });
    }
  };
  return (
    <>
      {Object.entries(entities).map((entry) => {
        switch (commands[entry[0]]) {
          case 'newEnvironment':
          case 'updateEnvironment':
            return (
              <forms.EnvironmentForm
                key={generateUuid()}
                formType={commands[entry[0]]}
                transfer={current}
                current={entry[1]}
                finished={() => finished(entry[0])}
              />
            );
          case 'updateRequest':
            return (
              <forms.RequestForm
                key={generateUuid()}
                transfer={current}
                current={entry[1]}
                finished={() => {
                  finished(entry[0]);
                }}
              />
            );
          case 'updateMapping':
            return (
              <forms.MappingForm
                transfer={current}
                current={entry[1]}
                finished={() => {
                  finished(entry[0]);
                }}
              />
            );
        }
      })}
    </>
  );
};

export default NodeForms;
