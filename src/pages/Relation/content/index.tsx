import React, { useEffect, useState } from 'react';
import { IFile, ITarget, IWorkTask } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';
import { Spin } from 'antd';

interface IProps {
  current: ITarget | 'disk';
}
/**
 * 关系-内容导航
 */
const Content: React.FC<IProps> = (props) => {
  if (!props.current) return <></>;
  const [current] = useState<ITarget>(
    props.current === 'disk' ? orgCtrl.user : props.current,
  );
  const [key] = useCtrlUpdate(current);
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  useEffect(() => {
    command.emitter('preview', 'relation', focusFile);
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
        if (
          file.key === orgCtrl.user.key &&
          [orgCtrl.user.key, ...orgCtrl.user.companys.map((i) => i.key)].includes(
            orgCtrl.currentKey,
          )
        ) {
          command.emitter('executor', 'open', 'disk');
        } else {
          command.emitter('executor', 'open', file);
        }
      }
    } else {
      submitHanlder(() => focusHanlder(file), 300);
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
    <Spin spinning={false} tip={'加载中...'}>
      <DirectoryViewer
        key={key}
        initTags={['全部']}
        selectFiles={[]}
        extraTags={true}
        focusFile={focusFile}
        content={getContent()}
        preDirectory={orgCtrl.currentKey === 'disk' ? undefined : current.superior}
        fileOpen={(entity, dblclick) => clickHanlder(entity as IFile, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IWorkTask)}
      />
    </Spin>
  );
};
export default Content;
