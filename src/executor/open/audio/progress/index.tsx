import React from 'react';
import cls from './index.module.less';
import { Progress } from 'antd';

const convertToTime = (decimal: number) => {
  const hours = Math.floor(decimal / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((decimal % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(decimal % 60)
    .toString()
    .padStart(2, '0');
  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
};
interface IProps {
  progress: number;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}
const AudioProgress: React.FC<IProps> = ({ audioRef, progress }) => {
  return (
    <>
      <span className={cls['audio-text']}>{convertToTime(progress)}</span>
      <div className={cls['audio-progress']}>
        <Progress
          percent={audioRef.current ? (progress / audioRef.current.duration) * 100 : 0}
          strokeColor={{
            '0%': '#9d9df9',
            '100%': '#9d9df9',
          }}
          showInfo={false}></Progress>
      </div>
      <span className={cls['audio-text']}>
        {audioRef.current?.duration
          ? convertToTime(audioRef.current.duration)
          : convertToTime(0)}
      </span>
    </>
  );
};

export default AudioProgress;
