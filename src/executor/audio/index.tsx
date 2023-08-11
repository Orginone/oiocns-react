import { FileItemModel } from 'src/ts/base/model';
import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'devextreme-react';
import cls from './index.module.less';
import {
  AiFillCaretRight,
  AiOutlineCloseCircle,
  AiOutlinePause,
  AiOutlineStepBackward,
  AiOutlineStepForward,
} from 'react-icons/ai';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { AiOutlineUnorderedList } from 'react-icons/ai';
import { Dropdown, Popover, Progress, Slider } from 'antd';
import type { MenuProps } from 'antd';
import { BsDisc } from 'react-icons/bs';
interface IProps {
  share: FileItemModel;
  finished: () => void;
  files: FileItemModel[] | undefined;
  audioId: number;
  setAudioData: (audioData: FileItemModel) => void;
}

const convertToTime = (decimal: number) => {
  const hours = Math.floor(decimal / 3600);
  const minutes = Math.floor((decimal % 3600) / 60);
  const seconds = Math.floor(decimal % 60);
  const hoursString = hours.toString().padStart(2, '0');
  const minutesString = minutes.toString().padStart(2, '0');
  const secondsString = seconds.toString().padStart(2, '0');
  if (hours === 0) {
    return `${minutesString}: ${secondsString}`;
  }
  return `${hoursString}: ${minutesString}: ${secondsString}`;
};

const AudioPlayer: React.FC<IProps> = ({
  share,
  finished,
  files,
  audioId,
  setAudioData,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);
  const [showVolume, setShowVolume] = useState(false);
  const [listColor, setListColor] = useState('#252525');
  const [audioList, setAudioList] = useState<MenuProps['items']>();

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: number) => {
    const volume = e;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    setVolume(volume);
    return;
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const openList = () => {
    setListColor(listColor === '#252525' ? '#7c7cc5' : '#252525');
  };

  const formatter = (value: number | undefined) => `${value}%`;

  const setMenus = () => {
    const item: MenuProps['items'] = [];
    if (!files) {
      return;
    }
    files.forEach((each) => {
      if (!each) {
        return;
      }
      if (each.name === share.name) {
        item.push({
          key: each.name,
          label: (
            <div className={cls['audio-list']}>
              {each.name}
              <BsDisc
                className={`${cls['audio-disc-icon']} ${cls['rotate-animation']}`}
                color={'#8875a9'}></BsDisc>
            </div>
          ),
        });
      } else {
        item.push({
          key: each.name!.toString(),
          label: <div>{each.name}</div>,
        });
      }
    });
    setAudioList(item);
  };

  const beginPlay = () => {
    if (!audioRef.current) {
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
    }
    audioRef.current.play();
  };

  const resetProgress = () => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = 0;
  };

  const preAudio = () => {
    if (!files) {
      return;
    }
    for (let i = 1; i < files.length; ++i) {
      if (files[i].name === share.name) {
        setAudioData(files[i - 1]);
        return;
      }
    }
    setAudioData(files[files.length - 1]);
  };
  const nextAudio = () => {
    if (!files) {
      return;
    }
    for (let i = 0; i < files.length - 1; ++i) {
      if (files[i].name === share.name) {
        setAudioData(files[i + 1]);
        return;
      }
    }
    setAudioData(files[0]);
  };

  useEffect(() => {
    beginPlay();
    resetProgress();
    setMenus();
  }, [share, audioId]);

  useEffect(() => {
    setMenus();
  }, [files]);

  if (share.shareLink) {
    if (!share.shareLink.includes('/orginone/anydata/bucket/load')) {
      share.shareLink = `/orginone/anydata/bucket/load/${share.shareLink}`;
    }
    return (
      <Draggable className={cls['audio-drag-box']}>
        <div className={cls['audio-top']}>
          <AiOutlineStepBackward size={22} onClick={preAudio}></AiOutlineStepBackward>
          <div className={cls['audio-but-box']}>
            <div onClick={togglePlay} className={cls['audio-target-box']}>
              {isPlaying ? (
                <AiOutlinePause size={22}></AiOutlinePause>
              ) : (
                <AiFillCaretRight size={22}></AiFillCaretRight>
              )}
            </div>
          </div>
          <AiOutlineStepForward size={22} onClick={nextAudio}></AiOutlineStepForward>
        </div>
        <div className={cls['audio-bottom']}>
          <Popover
            content={
              <div className={cls['audio-volume']}>
                <Slider
                  tooltip={{ formatter }}
                  vertical
                  value={volume}
                  defaultValue={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            }
            open={showVolume}
            onOpenChange={setShowVolume}>
            <HiOutlineSpeakerWave
              size={22}
              onClick={() => setShowVolume(!showVolume)}></HiOutlineSpeakerWave>
          </Popover>
          <span>{convertToTime(progress)}</span>
          <div className={cls['audio-progress']}>
            <Progress
              percent={
                audioRef.current ? (progress / audioRef.current.duration) * 100 : 0
              }
              strokeColor={{
                '0%': '#9d9df9',
                '100%': '#9d9df9',
              }}
              showInfo={false}></Progress>
          </div>
          <span>
            {audioRef.current?.duration
              ? convertToTime(audioRef.current.duration)
              : convertToTime(0)}
          </span>
          <Dropdown
            onOpenChange={(isOpen) => {
              setListColor(isOpen ? '#7c7cc5' : '#252525');
            }}
            overlayStyle={{
              zIndex: '100',
              paddingTop: '10px',
            }}
            placement="bottom"
            trigger={['click']}
            menu={{
              items: audioList,
              onClick: (e) => {
                openList();
                setAudioData(files?.filter((item) => item.name === e.key)[0]!);
                console.log(e.key);
              },
            }}>
            <AiOutlineUnorderedList
              size={22}
              color={listColor}
              onClick={openList}></AiOutlineUnorderedList>
          </Dropdown>
          <AiOutlineCloseCircle
            className={cls['audio-close']}
            onClick={finished}></AiOutlineCloseCircle>
        </div>
        <audio
          autoPlay
          src={share.shareLink}
          ref={audioRef}
          onTimeUpdate={updateProgress}></audio>
      </Draggable>
    );
  }
  finished();
  return <></>;
};

export default AudioPlayer;
