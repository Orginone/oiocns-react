import { FileItemModel } from 'src/ts/base/model';
import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'devextreme-react';
import cls from './index.module.less';
import {
  AiFillStepBackward,
  AiFillStepForward,
  AiOutlineCloseCircle,
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
} from 'react-icons/ai';
import { BiShuffle } from 'react-icons/bi';
import { TbRepeatOnce } from 'react-icons/tb';
import Speaker from '@/executor/audio/speaker';
import Menus from '@/executor/audio/menus';
import AudioProgress from '@/executor/audio/progress';
import { Directory } from '@/ts/core/thing/directory';
import AudioController from '@/executor/audio/controller';
interface IProps {
  share: FileItemModel;
  finished: () => void;
  directory: Directory;
}

const AudioPlayer: React.FC<IProps> = ({ share, finished, directory }) => {
  //当前播放的音频
  const [audioData, setAudioData] = useState(share);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isRandPlay, setIsRandPlay] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const audioInfo = directory.files.filter((item) =>
    item.filedata.contentType?.startsWith('audio'),
  );
  //音频播放列表
  const [audioFiles, setAudioFiles] = useState<FileItemModel[]>(
    audioInfo.map((item) => item.filedata),
  );
  useEffect(() => {
    resetProgress();
    if (!audioRef.current) {
      return;
    }
    const handleAudioEnd = () => {
      if (isLoop) {
        resetProgress();
        return;
      }
      isRandPlay ? handlePlay() : handlePlay(1);
    };
    audioRef.current?.addEventListener('ended', handleAudioEnd);
    return () => {
      audioRef.current?.removeEventListener('ended', handleAudioEnd);
    };
  }, [audioData]);
  useEffect(() => {
    setAudioData(share);
  }, [share]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying((prevState) => !prevState);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const resetProgress = () => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const playByStep = (step: number) => {
    let target: number = 0;
    for (let i = 0; i < audioFiles.length; ++i) {
      if (audioFiles[i].name === audioData.name) {
        target = i;
      }
    }
    setAudioData(audioFiles[(target + step + audioFiles.length) % audioFiles.length]);
  };

  const handlePlay = (step?: number) => {
    if (audioFiles.length === 0) {
      finished();
    }
    if (step) {
      playByStep(step);
      return;
    }
    const randNumber = Math.ceil(Math.random() * (audioFiles.length - 1));
    playByStep(randNumber);
  };

  if (audioData.shareLink) {
    if (!audioData.shareLink.includes('/orginone/anydata/bucket/load')) {
      audioData.shareLink = `/orginone/anydata/bucket/load/${audioData.shareLink}`;
    }
    return (
      <Draggable className={cls['audio-drag-box']}>
        <AudioController
          audioFiles={audioFiles}
          audioData={audioData}
          setAudioData={setAudioData}
          audioRef={audioRef}
          finished={finished}></AudioController>
        {/*<div className={cls['audio-top']}>*/}
        {/*  <BiShuffle*/}
        {/*    className={cls['audio-icon']}*/}
        {/*    color={isRandPlay ? '#7c7cc5' : '#252525'}*/}
        {/*    onClick={() => {*/}
        {/*      setIsRandPlay((prevState) => !prevState);*/}
        {/*    }}*/}
        {/*  />*/}
        {/*  <AiFillStepBackward*/}
        {/*    className={cls['audio-icon']}*/}
        {/*    onClick={() => {*/}
        {/*      isRandPlay ? handlePlay() : handlePlay(-1);*/}
        {/*    }}*/}
        {/*  />*/}
        {/*  <div onClick={togglePlay} className={cls['audio-target-box']}>*/}
        {/*    {isPlaying ? (*/}
        {/*      <AiOutlinePauseCircle*/}
        {/*        className={`${cls['audio-icon']} ${cls['audio-icon-play']}`}*/}
        {/*      />*/}
        {/*    ) : (*/}
        {/*      <AiOutlinePlayCircle*/}
        {/*        className={`${cls['audio-icon']} ${cls['audio-icon-play']}`}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*  <AiFillStepForward*/}
        {/*    onClick={() => {*/}
        {/*      isRandPlay ? handlePlay() : handlePlay(1);*/}
        {/*    }}*/}
        {/*    className={cls['audio-icon']}*/}
        {/*  />*/}
        {/*  <TbRepeatOnce*/}
        {/*    className={cls['audio-icon']}*/}
        {/*    color={isLoop ? '#7c7cc5' : '#252525'}*/}
        {/*    onClick={() => {*/}
        {/*      setIsLoop((prevState) => !prevState);*/}
        {/*    }}></TbRepeatOnce>*/}
        {/*</div>*/}
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
          src={audioData.shareLink}
          ref={audioRef}
          onTimeUpdate={updateProgress}></audio>
      </Draggable>
    );
  }
  finished();
  return <></>;
};

export default AudioPlayer;
