import { command } from '@/ts/base';
import DataExecutor from './data';
import ConfigExecutor from './config';
import React, { useEffect, useState } from 'react';

const Executor = () => {
  const [content, setContent] = useState(<></>);
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args) => {
      console.log(type, cmd, args);
      if (cmd === 'qrcode') {
        type = 'config';
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
