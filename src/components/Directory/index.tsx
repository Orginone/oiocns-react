import React, { useEffect, useState } from 'react';
import DirectoryViewer from './views';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';
import { IDirectory, IFile } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';
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
  const [loaded] = useAsyncLoad(() => dircetory.loadContent());
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  useEffect(() => {
    command.emitter('preview', props.previewFlag, focusFile);
  }, [focusFile]);
  const contextMenu = (file?: IFile) => {
    var entity = file || dircetory;
    if ('targets' in entity) {
      entity = entity.directory;
    }
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity, dircetory.key);
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
        props.onSelected(props.selects.filter((i) => i.key !== file.key));
      }
    }
  };

  const fileFocused = (file: IFile | undefined) => {
    if (file) {
      if (focusFile && file.key === focusFile.key) {
        return true;
      }
      return props.selects?.find((i) => i.key === file.key) !== undefined;
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
      submitHanlder(() => focusHanlder(file), 200);
    }
  };

  const getContent = () => {
    const contents: IFile[] = [];
    if (props.current === 'disk') {
      contents.push(
        orgCtrl.user.directory,
        ...orgCtrl.user.companys.map((i) => i.directory),
      );
    } else {
      contents.push(...props.current!.content());
    }
    return contents;
  };

  return (
    <Spin spinning={!loaded} tip={'加载中...'}>
      <DirectoryViewer
        key={key}
        extraTags
        initTags={['全部']}
        accepts={props.accepts}
        excludeIds={props.excludeIds}
        selectFiles={props.selects || []}
        focusFile={focusFile}
        content={getContent()}
        fileOpen={(entity, dblclick) => clickHanlder(entity as IFile, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IFile)}
      />
    </Spin>
  );
};
export default Directory;
