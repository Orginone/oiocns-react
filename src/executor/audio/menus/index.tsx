import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { BsDisc, BsMusicNoteList } from 'react-icons/bs';
import cls from './index.module.less';
import { FileItemModel } from 'src/ts/base/model';
import { Directory } from '@/ts/core/thing/directory';
interface IProp {
  setAudioData: (audioData: FileItemModel) => void;
  audioFiles: FileItemModel[];
  share: FileItemModel;
  directory: Directory;
  setAudioFiles: (audioFiles: FileItemModel[]) => void;
}
const Menus: React.FC<IProp> = ({
  audioFiles,
  share,
  setAudioData,
  directory,
  setAudioFiles,
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [audioList, setAudioList] = useState<MenuProps['items']>();

  useEffect(() => {
    const audioInfo = directory.files.filter((item) =>
      item.filedata.contentType?.startsWith('audio'),
    );
    setAudioFiles(audioInfo.map((item) => item.filedata));
    const item: MenuProps['items'] = [];
    audioFiles.forEach((each) => {
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
  }, [share, audioFiles]);

  useEffect(() => {
    const id = directory.taskEmitter.subscribe(() => {
      directory.loadFiles(true).then((files) => {
        const audioInfo = files.filter((item) =>
          item.filedata.contentType?.startsWith('audio'),
        );
        setAudioFiles(audioInfo.map((item) => item.filedata));
      });
    });
    return () => {
      directory.unsubscribe(id);
    };
  }, []);

  const clickMenu = (info: any) => {
    setAudioData(audioFiles.filter((item) => item.name === info.key)[0]!);
  };

  return (
    <Dropdown
      open={menuIsOpen}
      onOpenChange={(isOpen) => {
        setMenuIsOpen(isOpen);
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
          clickMenu(e);
        },
      }}>
      <BsMusicNoteList
        className={cls['audio-icon']}
        size={22}
        color={menuIsOpen ? '#7c7cc5' : '#252525'}
        onClick={() => {
          setMenuIsOpen((prevState) => !prevState);
        }}></BsMusicNoteList>
    </Dropdown>
  );
};

export default Menus;
