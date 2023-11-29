import React, { useEffect, useState } from 'react';
import DirectoryViewer from '@/components/Directory/views';
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
  current: IDirectory | 'disk';
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
    command.emitter('preview', 'store', focusFile);
  }, [focusFile]);
  const contextMenu = (file?: IFile) => {
    const entity = file ?? dircetory;
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity, dircetory.key);
      },
    };
  };

  const focusHanlder = (file: IFile | undefined) => {
    const focused = file && focusFile && file.key === focusFile.key;
    if (focused) {
      setFocusFile(undefined);
    } else {
      setFocusFile(file);
    }
  };

  const clickHanlder = (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick) {
      clearHanlder();
      if (file && !file.groupTags.includes('已删除')) {
        if (
          file.key === orgCtrl.user.directory.key &&
          [
            orgCtrl.user.directory.key,
            ...orgCtrl.user.companys.map((i) => i.directory.key),
          ].includes(orgCtrl.currentKey)
        ) {
          command.emitter('executor', 'open', 'disk');
        } else {
          command.emitter('executor', 'open', file);
        }
      }
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
      contents.push(...props.current.content());
    }
    return contents;
  };

  return (
    <Spin spinning={!loaded} tip={'加载中...'}>
      <DirectoryViewer
        key={key}
        extraTags
        initTags={['全部']}
        selectFiles={[]}
        focusFile={focusFile}
        content={getContent()}
        preDirectory={orgCtrl.currentKey === 'disk' ? undefined : dircetory.superior}
        fileOpen={(entity, dblclick) => clickHanlder(entity as IFile, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IFile)}
      />
    </Spin>
  );
};
export default Directory;
