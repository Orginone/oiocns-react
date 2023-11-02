import React, { useEffect, useState } from 'react';
import { IBelong, IFile, IWorkTask, TaskTypeName } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { Spin, message } from 'antd';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';

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
  useEffect(() => {
    const id = orgCtrl.work.notity.subscribe(() => loadContent('待办'));
    return () => {
      orgCtrl.work.notity.unsubscribe(id);
    };
  }, [props.current]);

  const contextMenu = (file?: IFile) => {
    return {
      items: cleanMenus(loadFileMenus(file)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, file);
      },
    };
  };

  const fileOpen = (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick && file) {
      if (!file.groupTags.includes('已删除')) {
        command.emitter('executor', 'open', file);
      }
    } else if (!dblclick) {
      if (file?.id === focusFile?.id) {
        setFocusFile(undefined);
        command.emitter('preview', 'work');
      } else {
        setFocusFile(file);
        command.emitter('preview', 'work', file);
      }
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

  const loadContent = (tag: string) => {
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
        initTags={['待办', '已办', '抄送', '发起的']}
        selectFiles={[]}
        focusFile={focusFile}
        content={content}
        extraTags={false}
        badgeCount={getBadgeCount}
        tagChanged={loadContent}
        fileOpen={(entity, dblclick) => fileOpen(entity as IWorkTask, dblclick)}
        contextMenu={(entity) => contextMenu(entity as IWorkTask)}
      />
    </Spin>
  );
};
export default Content;
