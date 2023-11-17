import React, { useEffect, useState } from 'react';
import { IBelong, IFile, IWorkTask } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';

interface IProps {
  current: IBelong | 'disk';
}
/**
 * 设置-配置清单
 */
const Content: React.FC<IProps> = (props) => {
  if (!props.current) return <></>;
  const [current] = useState<IBelong>(
    props.current === 'disk' ? orgCtrl.user : props.current,
  );
  const [key] = useCtrlUpdate(current);
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  useEffect(() => {
    command.emitter('preview', 'setting', focusFile);
  }, [focusFile]);
  const contextMenu = (file?: IFile) => {
    const entity = file ?? current;
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity, current.key);
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
      if (file) {
        command.emitter('executor', 'open', file);
      }
    } else {
      submitHanlder(() => focusHanlder(file), 200);
    }
  };

  const getContent = () => {
    const contents: IFile[] = [];
    if (props.current === 'disk') {
      contents.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.push(...props.current.content());
    }
    return contents;
  };

  return (
    <DirectoryViewer
      key={key}
      initTags={['全部']}
      selectFiles={[]}
      extraTags={true}
      focusFile={focusFile}
      content={getContent()}
      fileOpen={(entity, dblclick) => clickHanlder(entity as IFile, dblclick)}
      contextMenu={(entity) => contextMenu(entity as IWorkTask)}
    />
  );
};
export default Content;
