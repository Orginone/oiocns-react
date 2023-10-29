import React, { useState } from 'react';
import { IBelong, IFile, IWorkTask } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';

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
  const [focusFile, setFocusFile] = useState<IFile>();

  const contextMenu = (file?: IFile) => {
    const entity = file ?? current;
    return {
      items: cleanMenus(loadFileMenus(entity)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, entity, current.key);
      },
    };
  };

  const fileOpen = (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick && file) {
      command.emitter('executor', 'open', file);
    } else if (!dblclick) {
      if (file?.id === focusFile?.id) {
        setFocusFile(undefined);
        command.emitter('preview', 'setting');
      } else {
        setFocusFile(file);
        command.emitter('preview', 'setting', file);
      }
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
      initTags={['全部']}
      selectFiles={[]}
      extraTags={true}
      focusFile={focusFile}
      content={getContent()}
      fileOpen={(entity, dblclick) => fileOpen(entity as IWorkTask, dblclick)}
      contextMenu={(entity) => contextMenu(entity as IWorkTask)}
    />
  );
};
export default Content;
