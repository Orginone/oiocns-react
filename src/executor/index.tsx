import { command } from '@/ts/base';
import DataExecutor from './data';
import ConfigExecutor from './config';
import React, { useEffect, useState } from 'react';
import { executeCmd, FileTaskList } from './action';
import { useHistory } from 'react-router-dom';

const Executor = () => {
  const history = useHistory();
  const [content, setContent] = useState(<></>);
  const resetContent = () => {
    setContent(<></>);
  };
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args: any[]) => {
      console.log(type, cmd, args);
      if (cmd === 'link') return history.push(args[0]);
      if (cmd === 'openFolderWithEditor') {
        setContent(
          <DataExecutor
            cmd={cmd}
            args={args}
            finished={() => {
              setContent(<></>);
            }}
          />,
        );
        return () => {
          command.unsubscribe(id);
        };
      }
      if (cmd === 'taskList') return setContent(<FileTaskList directory={args[0]} />);
      if (executeCmd(cmd, args[0], args.slice(1)) === false) {
        if (['open','openFolderWithEditor', 'remark'].includes(cmd) && 'filedata' in args[0]) {
          type = 'data';
        }
        switch (type) {
          case 'data':
            setContent(<DataExecutor cmd={cmd} args={args} finished={resetContent} />);
            break;
          case 'config':
            setContent(<ConfigExecutor cmd={cmd} args={args} finished={resetContent} />);
            break;
          default:
            setContent(<></>);
            break;
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
