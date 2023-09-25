import { command } from '@/ts/base';
import DataExecutor from './data';
import ConfigExecutor from './config';
import React, { useEffect, useState } from 'react';
import { executeCmd, FileTaskList } from './action';
import { useHistory } from 'react-router-dom';
import AudioPlayer from '@/executor/audio';
const audioExt = ['.mp3', '.wav', '.ogg'];

const Executor = () => {
  const history = useHistory();
  const [audio, setAudio] = useState(<></>);
  const [content, setContent] = useState(<></>);
  const resetContent = () => {
    setContent(<></>);
  };
  const resetAudio = () => {
    setAudio(<></>);
  };
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args: any[]) => {
      if (cmd === 'link') return history.push(args[0]);
      if (cmd === 'taskList') return setContent(<FileTaskList directory={args[0]} />);
      if (executeCmd(cmd, args[0], args.slice(1), type) === false) {
        if (['open', 'remark'].includes(cmd) && 'filedata' in args[0]) {
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
            if (type === 'config' || type === 'data') {
              if (
                args[0].filedata?.contentType?.startsWith('audio') ||
                audioExt.includes(args[0].filedata?.extension ?? '-')
              ) {
                setAudio(
                  <AudioPlayer
                    finished={resetAudio}
                    directory={args[0].directory}
                    share={args[0].filedata}
                  />,
                );
              }
            }
            setContent(<></>);
            break;
        }
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  return (
    <>
      {content}
      {audio}
    </>
  );
};

export default Executor;
