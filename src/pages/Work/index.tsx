import React, { useEffect, useState } from 'react';
import { IFile, IWork, IWorkTask, TaskStatus, TaskTypeName } from '@/ts/core';
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
import { useKeyPress } from 'react-use';
import { AiOutlinePlus } from 'react-icons/ai';
import SelectWork from './select';
import FullScreenModal from '@/components/Common/fullScreen';

/**
 * 办事-事项清单
 */
const WorkContent: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [enable] = useKeyPress((e) => {
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      setEnabled(true);
    }
    if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
      setEnabled(false);
    }
    return true;
  });
  const [loaded, setLoaded] = useState(true);
  const [selectOpen, setSelectOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState('常用');
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
    if (enabled) {
      if (focusFile && focusFile.typeName == '加用户') {
        const task = focusFile as IWorkTask;
        if (task.targets && task.targets.length === 2) {
          if (task.targets[1].id === '505510232043163648') {
            setTimeout(
              (status) => {
                task.approvalTask(status);
              },
              500,
              task.targets[0].typeName === '人员'
                ? TaskStatus.RefuseStart
                : TaskStatus.ApprovalStart,
            );
          } else if (task.targets[1].id === '487319397317349376') {
            setTimeout(
              (status) => {
                task.approvalTask(status);
              },
              500,
              task.targets[0].typeName === '人员'
                ? TaskStatus.ApprovalStart
                : TaskStatus.RefuseStart,
            );
          }
        }
      }
    }
  }, [focusFile, enabled, enable]);

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
        setCurrentTag(tag);
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
      setCurrentTag('常用');
      setContent(value.filter((i) => i.typeName === '办事'));
    });
  };

  const renderMore = () => {
    if (currentTag === '常用') {
      return (
        <AiOutlinePlus
          fontSize={22}
          color={'#3838b9'}
          title={'选择事项'}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectOpen(true);
          }}
        />
      );
    }
    return <></>;
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
          currentTag={currentTag}
          height={'calc(100% - 100px)'}
          selectFiles={[]}
          focusFile={focusFile}
          content={content}
          badgeCount={getBadgeCount}
          tagChanged={(t) => loadContent(t)}
          initTags={['常用', '待办', '已办', '抄送', '发起的']}
          fileOpen={(entity, dblclick) => clickHanlder(entity as IWorkTask, dblclick)}
          contextMenu={(entity) => contextMenu(entity as IWorkTask)}
          rightBars={renderMore()}
        />
        {selectOpen && (
          <FullScreenModal
            open
            title={'选择办事'}
            onCancel={() => {
              setSelectOpen(false);
            }}
            destroyOnClose
            width={1000}
            bodyHeight={'75vh'}>
            <SelectWork
              onSelected={(work: IWork) => {
                setSelectOpen(false);
                setTimeout(() => {
                  setFocusFile(work);
                }, 500);
              }}
            />
          </FullScreenModal>
        )}
      </Spin>
    </AppLayout>
  );
};
export default WorkContent;
