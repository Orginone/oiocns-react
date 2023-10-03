import React, { useState } from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory, IFile } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';
import TagsBar from './tagsBar';

interface IProps {
  mode: number;
  accepts?: string[];
  selects?: IFile[];
  onSelected?: (files: IFile[]) => void;
  current: IDirectory | undefined | 'disk';
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = (props) => {
  if (!props.current) return <></>;
  const selects = props.selects ?? [];
  const [dircetory] = useState<IDirectory>(
    props.current === 'disk' ? orgCtrl.user.directory : props.current,
  );
  const [key] = useCtrlUpdate(dircetory);
  const cmdType = props.mode === 1 ? 'data' : 'config';
  const [currentTag, setCurrentTag] = useState('全部');
  const [loaded] = useAsyncLoad(() => dircetory.loadContent());
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const [focusFile, setFocusFile] = useState<IFile>();
  const contextMenu = (file?: IFile, clicked?: Function) => {
    var entity = file || dircetory;
    if ('targets' in entity) {
      entity = entity.directory;
    }
    return {
      items: loadFileMenus(entity, props.mode),
      onClick: ({ key }: { key: string }) => {
        command.emitter(cmdType, key, file || dircetory, dircetory.key);
        clicked?.apply(this, []);
      },
    };
  };

  const fileOpen = async (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick && file && props.mode < 10) {
      command.emitter(cmdType, 'open', file);
    } else if (!dblclick) {
      if (file?.id === focusFile?.id) {
        setFocusFile(undefined);
        props.onSelected?.apply(this, [selects.filter((i) => i.id !== file?.id)]);
        command.emitter('preview', 'open');
      } else {
        setFocusFile(file);
        if (file && selects.every((i) => i.id !== file.id)) {
          selects.push(file);
        }
        props.onSelected?.apply(this, [selects]);
        command.emitter('preview', 'open', file);
      }
    }
  };

  const getContent = (filter: boolean = true) => {
    const contents: IFile[] = [];
    if (props.current === 'disk') {
      contents.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.push(...props.current!.content(props.mode));
    }
    const tagFilter = (file: IFile) => {
      let success = true;
      if (filter && currentTag !== '全部') {
        success = file.groupTags.includes(currentTag);
      }
      if (success && props.accepts && props.accepts.length > 0) {
        success = file.groupTags.some((i) => props.accepts!.includes(i));
      }
      return success;
    };
    return contents.filter(tagFilter);
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
        descriptions={[
          `${getContent().length}个项目`,
          selects.length > 0 ? `选中${selects.length}个项目` : '',
        ]}
        content={
          <Spin spinning={!loaded} delay={10} tip={'加载中...'}>
            {segmented === 'table' ? (
              <TableMode
                selectFiles={selects}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : segmented === 'icon' ? (
              <IconMode
                selectFiles={selects}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : (
              <ListMode
                selectFiles={selects}
                focusFile={focusFile}
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
