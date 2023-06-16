import { command } from '@/ts/base';
import DataExecutor from './data';
import ConfigExecutor from './config';
import React, { useEffect, useState } from 'react';
import { IDirectory, IMemeber, IMsgChat } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import { useHistory } from 'react-router-dom';

const Executor = () => {
  const history = useHistory();
  const [content, setContent] = useState(<></>);
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args) => {
      console.log(type, cmd, args);
      switch (cmd) {
        case 'qrcode':
          type = 'config';
          break;
        case 'refresh':
          (args[0] as IDirectory).loadContent(true).then(() => {
            orgCtrl.changCallback();
          });
          return;
        case 'openChat':
          if (args[0].typeName === '目录') {
            orgCtrl.currentKey = (args[0] as IDirectory).target.chatdata.fullId;
          } else if ('fullId' in args[0]) {
            orgCtrl.currentKey = (args[0] as IMemeber).fullId;
          } else {
            orgCtrl.currentKey = (args[0] as IMsgChat).chatdata.fullId;
          }
          history.push('/chat');
          return;
      }
      switch (type) {
        case 'data':
          setContent(
            <DataExecutor
              cmd={cmd}
              args={args}
              finished={() => {
                setContent(<></>);
              }}
            />,
          );
          break;
        case 'config':
          setContent(
            <ConfigExecutor cmd={cmd} args={args} finished={() => setContent(<></>)} />,
          );
          break;
        default:
          setContent(<></>);
          break;
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  return content;
};

export default Executor;
