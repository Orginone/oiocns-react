import React, { useEffect, useState } from 'react';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import useStorage from '@/hooks/useStorage';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory, IFile } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';
import TagsBar from './tagsBar';
import { cleanMenus } from '@/utils/tools';

interface IProps {
  dialog?: boolean;
  accepts?: string[];
  selects?: IFile[];
  excludeIds?: string[];
  previewFlag: string;
  onFocused?: (file: IFile | undefined) => void;
  onSelected?: (files: IFile[]) => void;
  current: IDirectory | undefined | 'disk';
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = (props) => {
  if (!props.current) return <></>;
  const [dircetory] = useState<IDirectory>(
    props.current === 'disk' ? orgCtrl.user.directory : props.current,
  );
  const [key] = useCtrlUpdate(dircetory);
  const [currentTag, setCurrentTag] = useState('全部');
  const [loaded] = useAsyncLoad(() => dircetory.loadContent());
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  useEffect(() => {
    command.emitter('preview', props.previewFlag, focusFile);
  }, [focusFile]);
  const contextMenu = (file?: IFile, clicked?: Function) => {
    var entity = file || dircetory;
    if ('targets' in entity) {
      entity = entity.directory;
    }
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity, dircetory.key);
        clicked?.apply(this, []);
      },
    };
  };

  const fileOpen = (file: IFile | undefined) => {
    if (file && props.dialog !== true) {
      if (!file.groupTags.includes('已删除')) {
        command.emitter('executor', 'open', file);
      }
    }
  };

  const selectHanlder = (file: IFile, selected: boolean) => {
    if (props.selects && props.onSelected) {
      if (selected) {
        props.onSelected([...props.selects, file]);
      } else {
        props.onSelected(props.selects.filter((i) => i.id !== file.id));
      }
    }
  };

  const fileFocused = (file: IFile | undefined) => {
    if (file) {
      if (focusFile && file.id === focusFile.id) {
        return true;
      }
      return props.selects?.find((i) => i.id === file.id) !== undefined;
    }
    return false;
  };

  const focusHanlder = (file: IFile | undefined) => {
    const focused = fileFocused(file);
    if (focused) {
      setFocusFile(undefined);
      props.onFocused?.apply(this, [undefined]);
    } else {
      setFocusFile(file);
      props.onFocused?.apply(this, [file]);
    }
    if (file && props.onSelected) {
      selectHanlder(file, !focused);
    }
  };

  const clickHanlder = (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick) {
      clearHanlder();
      fileOpen(file);
    } else {
      submitHanlder(() => focusHanlder(file), 100);
    }
  };

  const getContent = (filter: boolean = true) => {
    if (filter && currentTag == '已选中') {
      return props.selects || [];
    }
    const contents: IFile[] = [];
    if (props.current === 'disk') {
      contents.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.push(...props.current!.content());
    }
    const tagFilter = (file: IFile) => {
      let success = true;
      if (props.excludeIds && props.excludeIds.length > 0) {
        success = !props.excludeIds.includes(file.id);
      }
      if (filter && success) {
        if (currentTag !== '全部') {
          success = file.groupTags.includes(currentTag);
        } else {
          success = !file.groupTags.includes('已删除');
        }
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
        selectFiles={props.selects || []}
        entitys={getContent(false)}
        onChanged={(t) => setCurrentTag(t)}></TagsBar>
      <SegmentContent
        key={key}
        onSegmentChanged={setSegmented}
        descriptions={`${getContent().length}个项目`}
        content={
          <Spin spinning={!loaded} delay={10} tip={'加载中...'}>
            {segmented === 'table' ? (
              <TableMode
                selectFiles={props.selects || []}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={clickHanlder}
                contextMenu={contextMenu}
              />
            ) : segmented === 'icon' ? (
              <IconMode
                selectFiles={props.selects || []}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={clickHanlder}
                contextMenu={contextMenu}
              />
            ) : (
              <ListMode
                selectFiles={props.selects || []}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={clickHanlder}
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
