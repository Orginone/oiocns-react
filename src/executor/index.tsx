import { command } from '@/ts/base';
import OpenExecutor from './open';
import DesignExecutor from './design';
import OperateExecutor from './operate';
import React, { useEffect, useState } from 'react';
import { executeCmd } from './action';
import { useHistory } from 'react-router-dom';

const Executor = () => {
  const history = useHistory();
  const [content, setContent] = useState(<></>);
  const resetContent = () => {
    setContent(<></>);
  };
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args: any[]) => {
      if (type != 'executor') return;
      if (cmd === 'link') return history.push(args[0]);
      if (executeCmd(cmd, args[0]) === false) {
        switch (cmd) {
          case 'open':
          case 'remark':
            setContent(
              <OpenExecutor cmd={cmd} entity={args[0]} finished={resetContent} />,
            );
            return;
          case 'design':
            setContent(
              <DesignExecutor cmd={cmd} entity={args[0]} finished={resetContent} />,
            );
            return;
          default:
            setContent(<OperateExecutor cmd={cmd} args={args} finished={resetContent} />);
            return;
        }
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  return content;
};

export default Executor;
