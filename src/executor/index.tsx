import { command } from '@/ts/base';
import DataExecutor from './data';
import ConfigExecutor from './config';
import React, { useEffect, useState } from 'react';
import { executeCmd, FileTaskList } from './action';
import { useHistory } from 'react-router-dom';
import AudioPlayer from '@/executor/audio';
import { FileItemModel } from '@/ts/base/model';
const audioExt = ['.mp3', '.wav', '.ogg'];

const Executor = () => {
  const history = useHistory();
  const [content, setContent] = useState(<></>);
  const [playAudio, setPlayAudio] = useState(false);
  const [audioData, setAudioData] = useState<FileItemModel>();
  const [audioFiles, setAudioFiles] = useState<FileItemModel[]>();
  const [audioId, setAudioId] = useState(1);
  const resetContent = () => {
    setContent(<></>);
  };
  const stopPlay = () => {
    setPlayAudio(false);
  };
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args: any[]) => {
      if (cmd === 'link') return history.push(args[0]);
      if (cmd === 'taskList') return setContent(<FileTaskList directory={args[0]} />);
      if (executeCmd(cmd, args[0], args.slice(1)) === false) {
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
            setContent(<></>);
            break;
        }
        if (
          args[0].filedata.contentType?.startsWith('audio') ||
          audioExt.includes(args[0].filedata.extension ?? '-')
        ) {
          const files = args[0].directory.files.filter(
            (item: { filedata: { contentType: string } }) =>
              item.filedata.contentType?.startsWith('audio'),
          );
          setAudioId((prevAudioId) => prevAudioId + 1);
          setPlayAudio(true);
          setAudioData(args[0].filedata);
          setAudioFiles(files.map((item: { filedata: any }) => item.filedata));
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
      {playAudio && (
        <AudioPlayer
          finished={stopPlay}
          share={audioData!}
          files={audioFiles}
          audioId={audioId}
          setAudioData={setAudioData}
        />
      )}
    </>
  );
};

export default Executor;
