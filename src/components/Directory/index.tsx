import React, { useState } from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory, IFileInfo } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command, schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';
import TagsBar from './tagsBar';

interface IProps {
  mode: number;
  current: IDirectory | undefined | 'disk';
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = ({ mode, current }: IProps) => {
  if (!current) return <></>;
  const [dircetory] = useState<IDirectory>(
    current === 'disk' ? orgCtrl.user.directory : current,
  );
  const [key] = useCtrlUpdate(dircetory);
  const cmdType = mode === 1 ? 'data' : 'config';
  const [currentTag, setCurrentTag] = useState('全部');
  const [loaded] = useAsyncLoad(() => dircetory.loadContent());
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const [select, setSelect] = useState<IFileInfo<schema.XEntity>>();
  const contextMenu = (file?: IFileInfo<schema.XEntity>, clicked?: Function) => {
    var entity = file || dircetory;
    if ('targets' in entity) {
      entity = entity.directory;
    }
    return {
      items: loadFileMenus(entity, mode),
      onClick: ({ key }: { key: string }) => {
        command.emitter(cmdType, key, file || dircetory, dircetory.key);
        clicked?.apply(this, []);
      },
    };
  };

  const fileOpen = async (
    file: IFileInfo<schema.XEntity> | undefined,
    dblclick: boolean,
  ) => {
    if (dblclick && file) {
      command.emitter(cmdType, 'open', file);
    } else if (!dblclick) {
      if (file?.id === select?.id) {
        setSelect(undefined);
        command.emitter('preview', 'open');
      } else {
        setSelect(file);
        command.emitter('preview', 'open', file);
      }
    }
  };

  const getContent = (filter: boolean = true) => {
    const contents: IFileInfo<schema.XEntity>[] = [];
    if (current === 'disk') {
      contents.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.push(...current.content(mode));
    }
    if (filter && currentTag !== '全部') {
      return contents.filter((i) => i.groupTags.includes(currentTag));
    }
    return contents;
  };

  return (
    <>
      <TagsBar
        select={currentTag}
        initTags={['全部']}
        entitys={getContent(false)}
        onChanged={(t) => setCurrentTag(t)}></TagsBar>
      <SegmentContent
        key={key}
        onSegmentChanged={setSegmented}
        description={`${getContent().length}个项目`}
        content={
          <Spin spinning={!loaded} delay={10} tip={'加载中...'}>
            {segmented === 'table' ? (
              <TableMode
                select={select}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : segmented === 'icon' ? (
              <IconMode
                select={select}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : (
              <ListMode
                select={select}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            )}
          </Spin>
        }
      />
    </>
  );
};
export default Directory;
