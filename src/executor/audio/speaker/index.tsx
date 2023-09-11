import { Popover, Slider } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import cls from './index.module.less';
import { ImVolumeHigh, ImVolumeLow, ImVolumeMedium, ImVolumeMute2 } from '@/icons/im';
interface IProps {
  audioRef: any;
}

const Speaker: React.FC<IProps> = ({ audioRef }) => {
  const [volume, setVolume] = useState(100);
  const [isMute, setIsMute] = useState(false);
  const [speakerNode, setSpeakerNode] = useState<ReactElement>();
  const [muteSpeakerNode, setMuteSpeakerNode] = useState<ReactElement>();

  useEffect(() => {
    handleVolumeChange(volume, false);
  }, []);

  const handleVolumeChange = (e: number, isOpen: boolean = true) => {
    const volume = e;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    setVolume(volume);
    setMuteSpeakerNode(
      <ImVolumeMute2
        onClick={() => {
          if (volume !== 0) {
            setIsMute((prevState) => !prevState);
            audioRef.current.muted = false;
          }
        }}
        color={isOpen ? '#7c7cc5' : '#252525'}
        size={22}
        className={cls['audio-icon']}
      />,
    );
    if (volume > 66) {
      setSpeakerNode(
        <ImVolumeHigh
          onClick={() => {
            setIsMute((prevState) => !prevState);
            audioRef.current.muted = true;
          }}
          color={isOpen ? '#7c7cc5' : '#252525'}
          size={22}
          className={cls['audio-icon']}
        />,
      );
    } else if (volume > 33) {
      setSpeakerNode(
        <ImVolumeMedium
          onClick={() => {
            setIsMute((prevState) => !prevState);
            audioRef.current.muted = true;
          }}
          color={isOpen ? '#7c7cc5' : '#252525'}
          size={22}
          className={cls['audio-icon']}
        />,
      );
    } else if (volume > 0) {
      setSpeakerNode(
        <ImVolumeLow
          onClick={() => {
            setIsMute((prevState) => !prevState);
            audioRef.current.muted = true;
          }}
          color={isOpen ? '#7c7cc5' : '#252525'}
          size={22}
          className={cls['audio-icon']}
        />,
      );
    } else {
      setIsMute(true);
    }
    return;
  };

  return (
    <Popover
      overlayStyle={{ zIndex: 1025 }}
      onOpenChange={(isOpen) => {
        handleVolumeChange(volume, isOpen);
      }}
      content={
        <div className={cls['audio-volume']}>
          <Slider
            tooltip={{ formatter: (value) => `${value}%` }}
            vertical
            value={volume}
            defaultValue={volume}
            onChange={(e) => {
              setIsMute(false);
              audioRef.current.muted = false;
              handleVolumeChange(e);
            }}
          />
        </div>
      }>
      {isMute ? muteSpeakerNode : speakerNode}
    </Popover>
  );
};

export default Speaker;
