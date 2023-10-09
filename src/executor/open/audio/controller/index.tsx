import { BiShuffle } from '@/icons/bi';
import {
  AiFillStepBackward,
  AiFillStepForward,
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
} from '@/icons/ai';
// import { TbRepeatOnce } from '@/icons/tb';
import cls from './index.module.less';
import React, { useEffect, useState } from 'react';
import { FileItemShare } from '@/ts/base/model';

interface IProp {
  audioData: FileItemShare;
  setAudioData: (audioData: FileItemShare) => void;
  audioFiles: FileItemShare[];
  audioRef: any;
  finished: () => void;
}
const AudioController: React.FC<IProp> = ({
  audioData,
  setAudioData,
  audioRef,
  audioFiles,
  finished,
}) => {
  const [isRandPlay, setIsRandPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  // const [isLoop, setIsLoop] = useState(false);
  useEffect(() => {
    resetProgress();
    if (!audioRef.current) {
      return;
    }
    const handleAudioEnd = () => {
      // if (isLoop) {
      //   resetProgress();
      //   return;
      // }
      isRandPlay ? handlePlay() : handlePlay(1);
    };
    audioRef.current?.addEventListener('ended', handleAudioEnd);
    return () => {
      audioRef.current?.removeEventListener('ended', handleAudioEnd);
    };
  }, [audioData]);
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

  return (
    <div className={cls['audio-controller']}>
      <BiShuffle
        className={cls['audio-icon']}
        color={isRandPlay ? '#7c7cc5' : '#252525'}
        onClick={() => {
          setIsRandPlay((prevState) => !prevState);
        }}
      />
      <AiFillStepBackward
        className={cls['audio-icon']}
        onClick={() => {
          isRandPlay ? handlePlay() : handlePlay(-1);
        }}
      />
      <div onClick={togglePlay} className={cls['audio-target-box']}>
        {isPlaying ? (
          <AiOutlinePauseCircle
            className={`${cls['audio-icon']} ${cls['audio-icon-play']}`}
          />
        ) : (
          <AiOutlinePlayCircle
            className={`${cls['audio-icon']} ${cls['audio-icon-play']}`}
          />
        )}
      </div>
      <AiFillStepForward
        onClick={() => {
          isRandPlay ? handlePlay() : handlePlay(1);
        }}
        className={cls['audio-icon']}
      />
      {/* <TbRepeatOnce
        className={cls['audio-icon']}
        color={isLoop ? '#7c7cc5' : '#252525'}
        onClick={() => {
          setIsLoop((prevState) => !prevState);
        }}></TbRepeatOnce> */}
    </div>
  );
};

export default AudioController;
