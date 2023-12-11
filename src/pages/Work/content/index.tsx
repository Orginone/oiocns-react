import React, { useEffect, useState } from 'react';
import { IFile, IWorkTask, TaskTypeName } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { Spin, message } from 'antd';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';

/**
 * 办事-事项清单
 */
const Content: React.FC = () => {
  const [loaded, setLoaded] = useState(true);
  const [content, setContent] = useState<IFile[]>([]);
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();

  useEffect(() => {
    const id = orgCtrl.work.notity.subscribe(() => loadContent('待办'));
    return () => {
      orgCtrl.work.notity.unsubscribe(id);
    };
  }, []);

  useEffect(() => {
    command.emitter('preview', 'work', focusFile);
  }, [focusFile]);

  useEffect(() => {
    command.emitter('preview', 'work', focusFile);
  }, [focusFile]);

  const contextMenu = (file?: IFile) => {
    return {
      items: cleanMenus(loadFileMenus(file)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, file);
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

  const getBadgeCount = (tag: string) => {
    if (tag === '待办') {
      return orgCtrl.work.todos.length;
    }
    return 0;
  };

  const loadContent = (tag: string) => {
    console.log(tag);
    if (tag?.length < 2) return;
    setLoaded(false);
    orgCtrl.work
      .loadContent(tag as TaskTypeName)
      .then((tasks) => {
        const newTasks = tasks.sort((a, b) => {
          return (
            new Date(b.taskdata.createTime).getTime() -
            new Date(a.taskdata.createTime).getTime()
          );
        });
        setContent([...newTasks]);
        setLoaded(true);
      })
      .catch((reason) => {
        message.error(reason);
        setContent([]);
        setLoaded(true);
      });
  };

  return (
    <Spin spinning={!loaded} tip={'加载中...'}>
      <DirectoryViewer
        initTags={['待办', '已办', '抄送', '发起的']}
        selectFiles={[]}
        focusFile={focusFile}
        content={content}
        extraTags={false}
        badgeCount={getBadgeCount}
        tagChanged={loadContent}
        fileOpen={(entity, dblclick) => clickHanlder(entity as IWorkTask, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IWorkTask)}
      />
    </Spin>
  );
};
export default Content;
