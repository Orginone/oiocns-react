import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { BsMusicNoteList } from '@/icons/bs';
import cls from './index.module.less';
import { FileItemModel } from 'src/ts/base/model';
import { Directory } from '@/ts/core/thing/directory';
import { ImSpinner4 } from '@/icons/im';
interface IProp {
  audioData: FileItemModel;
  setAudioData: (audioData: FileItemModel) => void;
  audioFiles: FileItemModel[];
  setAudioFiles: (audioFiles: FileItemModel[]) => void;
  directory: Directory;
}
const Menus: React.FC<IProp> = ({
  audioData,
  setAudioData,
  audioFiles,
  setAudioFiles,
  directory,
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
      if (each.name === audioData.name) {
        item.push({
          key: each.name,
          label: (
            <div className={cls['audio-list']}>
              {each.name}
              <ImSpinner4
                className={`${cls['audio-disc-icon']} ${cls['rotate-animation']}`}
                color={'#8875a9'}></ImSpinner4>
            </div>
          ),
        });
      } else {
        item.push({
          key: each.name!.toString(),
          label: (
            <div className={cls['audio-list']}>
              {each.name}
              <ImSpinner4
                visibility={'hidden'}
                className={`${cls['audio-disc-icon']} ${cls['rotate-animation']}`}
                color={'#8875a9'}></ImSpinner4>
            </div>
          ),
        });
      }
    });
    setAudioList(item);
  }, [audioData, audioFiles]);

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
        paddingTop: '10px',
        width: 'max-content',
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
