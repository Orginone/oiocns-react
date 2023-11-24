import { command } from '@/ts/base';
import OpenExecutor from './open';
import DesignExecutor from './design';
import OperateExecutor from './operate';
import React, { useEffect, useState } from 'react';
import { executeCmd } from './action';
import { useHistory } from 'react-router-dom';

const Executor: React.FC = () => {
  const history = useHistory();
  const [preview, setPreview] = useState(<></>);
  const [content, setContent] = useState(<></>);
  const resetCtx = (ctx: boolean = true) => {
    if (ctx) {
      setContent(<></>);
    } else {
      setPreview(<></>);
    }
  };
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args: any[]) => {
      if (type != 'executor') return;
      if (cmd === 'link') return history.push(args[0]);
      if (executeCmd(cmd, args[0]) === false) {
        switch (cmd) {
          case 'open':
          case 'remark':
            if (args.length > 1 && args[1] == 'preview') {
              setPreview(
                <OpenExecutor
                  cmd={cmd}
                  entity={args[0]}
                  finished={() => resetCtx(false)}
                />,
              );
            } else {
              setContent(<OpenExecutor cmd={cmd} entity={args[0]} finished={resetCtx} />);
            }
            return;
          case 'design':
          case 'fillWork':
            setContent(<DesignExecutor cmd={cmd} entity={args[0]} finished={resetCtx} />);
            return;
          default:
            setContent(<OperateExecutor cmd={cmd} args={args} finished={resetCtx} />);
            return;
        }
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  return (
    <>
      {preview}
      {content}
    </>
  );
};

export default Executor;
