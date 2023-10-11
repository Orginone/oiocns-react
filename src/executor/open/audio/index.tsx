import { FileItemShare } from 'src/ts/base/model';
import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'devextreme-react';
import cls from './index.module.less';
import { AiOutlineCloseCircle } from '@/icons/ai';
import Speaker from './speaker';
import Menus from './menus';
import AudioProgress from './progress';
import AudioController from './controller';
import { shareOpenLink } from '@/utils/tools';
import { IDirectory } from '@/ts/core';
interface IProps {
  share: FileItemShare;
  finished: () => void;
  directory?: IDirectory;
}

const AudioPlayer: React.FC<IProps> = ({ share, finished, directory }) => {
  //当前播放的音频
  const [audioData, setAudioData] = useState(share);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const audioInfo = directory?.files.filter((item) =>
    item.filedata.contentType?.startsWith('audio'),
  );
  //音频播放列表
  const [audioFiles, setAudioFiles] = useState<FileItemShare[]>(
    audioInfo?.map((item) => item.filedata) ?? [],
  );
  useEffect(() => {
    setAudioData(share);
  }, [share]);

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  if (audioData.shareLink) {
    return (
      <Draggable className={cls['audio-drag-box']}>
        <AudioController
          audioFiles={audioFiles}
          audioData={audioData}
          setAudioData={setAudioData}
          audioRef={audioRef}
          finished={finished}></AudioController>
        <div className={cls['audio-bottom']}>
          <Speaker audioRef={audioRef}></Speaker>
          <AudioProgress audioRef={audioRef} progress={progress}></AudioProgress>
          <Menus
            audioFiles={audioFiles}
            audioData={audioData}
            setAudioData={setAudioData}
            directory={directory}
            setAudioFiles={setAudioFiles}></Menus>
          <AiOutlineCloseCircle
            className={cls['audio-close']}
            onClick={finished}></AiOutlineCloseCircle>
        </div>
        <audio
          autoPlay
          src={shareOpenLink(audioData.shareLink)}
          ref={audioRef}
          onTimeUpdate={updateProgress}></audio>
      </Draggable>
    );
  }
  finished();
  return <></>;
};

export default AudioPlayer;
