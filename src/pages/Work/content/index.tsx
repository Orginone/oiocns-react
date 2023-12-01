import React, { useEffect, useState } from 'react';
import { IBelong, IFile, IWork, IWorkTask, TaskTypeName } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { Spin, message } from 'antd';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import OpenFileDialog from '@/components/OpenFileDialog';

interface IProps {
  current: IBelong | 'disk';
}
/**
 * 办事-事项清单
 */
const Content: React.FC<IProps> = (props) => {
  if (!props.current) return <></>;
  const [loaded, setLoaded] = useState(true);
  const [content, setContent] = useState<IFile[]>([]);
  const [focusFile, setFocusFile] = useState<IFile>();
  const [submitHanlder, clearHanlder] = useTimeoutHanlder();
  const [center, setCenter] = useState(<></>);
  useFlagCmdEmitter('works', () => loadWork());

  useEffect(() => {
    const id = orgCtrl.work.notity.subscribe(() => loadContent('常用办事'));
    return () => {
      orgCtrl.work.notity.unsubscribe(id);
    };
  }, [props.current]);

  useEffect(() => {
    command.emitter('preview', 'work', focusFile);
  }, [focusFile]);

  const openDisk = () => {
    setCenter(
      <OpenFileDialog
        accepts={['办事']}
        rootKey={'disk'}
        onOk={() => setCenter(<></>)}
        onCancel={() => setCenter(<></>)}
      />,
    );
  };

  const contextMenu = (file?: IFile) => {
    return {
      items: cleanMenus(loadFileMenus(file)) || [{ key: 'openDisk', label: '设置常用' }],
      onClick: ({ key }: { key: string }) => {
        if (key == 'openDisk') {
          openDisk();
          return;
        }
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

  const currentFilter = (task: IWorkTask) => {
    if (props.current === 'disk') {
      return true;
    }
    return task.taskdata.belongId === props.current.id;
  };

  const getBadgeCount = (tag: string) => {
    if (tag === '待办') {
      return orgCtrl.work.todos.filter(currentFilter).length;
    }
    return 0;
  };

  const loadWork = async () => {
    setLoaded(false);
    try {
      const works: IWork[] = await orgCtrl.loadWorks();
      setContent(works.filter((item) => item.cache.tags?.find((item) => item == '常用')));
    } catch (error) {
      message.error((error as Error)?.message);
      setContent([]);
    }
    setLoaded(true);
  };

  const loadContent = (tag: string) => {
    if (tag?.length < 2) return;
    if (tag == '常用办事') {
      loadWork();
      return;
    }
    setLoaded(false);
    orgCtrl.work
      .loadContent(tag as TaskTypeName)
      .then((tasks) => {
        setContent(
          tasks.filter(currentFilter).sort((a, b) => {
            return (
              new Date(b.taskdata.createTime).getTime() -
              new Date(a.taskdata.createTime).getTime()
            );
          }),
        );
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
        initTags={['常用办事', '待办', '已办', '抄送', '发起的']}
        selectFiles={[]}
        focusFile={focusFile}
        content={content}
        extraTags={false}
        badgeCount={getBadgeCount}
        tagChanged={loadContent}
        fileOpen={(entity, dblclick) => clickHanlder(entity as IWorkTask, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IWorkTask)}
      />
      {center}
    </Spin>
  );
};
export default Content;
