import React, { useEffect, useState } from 'react';
import { IFile, IWorkTask, TaskTypeName } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { Spin, message } from 'antd';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';
import AppLayout from '@/components/MainLayout/appLayout';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';

/**
 * 办事-事项清单
 */
const WorkContent: React.FC = () => {
  const [loaded, setLoaded] = useState(true);
  const [content, setContent] = useState<IFile[]>([]);
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  const [, key] = useFlagCmdEmitter('_commons', () => loadContent('常用'));
  useEffect(() => {
    const id = orgCtrl.work.notity.subscribe(() => loadContent('待办'));
    return () => {
      orgCtrl.work.notity.unsubscribe(id);
    };
  }, []);

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
    if (tag?.length < 2) return;
    if (tag === '常用') {
      loadCommons();
    } else {
      loadTasks(tag);
    }
    setFocusFile(undefined);
  };
  const loadTasks = (tag: string) => {
    setLoaded(false);
    orgCtrl.work
      .loadContent(tag as TaskTypeName)
      .then((tasks) => {
        const newTasks = tasks.sort((a, b) => {
          return (
            new Date(b.taskdata.updateTime).getTime() -
            new Date(a.taskdata.updateTime).getTime()
          );
        });
        setContent([...newTasks]);
        if (tag === '待办' && newTasks.length > 0) {
          setFocusFile(newTasks[0]);
        }
        setLoaded(true);
      })
      .catch((reason) => {
        message.error(reason);
        setContent([]);
        setLoaded(true);
      });
  };

  const loadCommons = () => {
    setLoaded(false);
    orgCtrl.loadCommons().then((value) => {
      setLoaded(true);
      setContent(value.filter((i) => i.typeName === '办事'));
    });
  };

  return (
    <AppLayout previewFlag={'work'}>
      <Spin spinning={!loaded} tip={'加载中...'}>
        <div key={key} style={{ marginLeft: 10, padding: 2, fontSize: 16 }}>
          <OrgIcons work selected />
          <span style={{ paddingLeft: 10 }}>办事</span>
        </div>
        <DirectoryViewer
          extraTags={false}
          height={'calc(100% - 100px)'}
          initTags={['常用', '待办', '已办', '抄送', '发起的']}
          selectFiles={[]}
          focusFile={focusFile}
          content={content}
          badgeCount={getBadgeCount}
          tagChanged={loadContent}
          fileOpen={(entity, dblclick) => clickHanlder(entity as IWorkTask, dblclick)}
          contextMenu={(entity) => contextMenu(entity as IWorkTask)}
        />
      </Spin>
    </AppLayout>
  );
};
export default WorkContent;
