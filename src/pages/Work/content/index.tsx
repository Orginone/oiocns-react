import React, { useEffect, useState } from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import SegmentContent from '@/components/Common/SegmentContent';
import { IBelong, IFile, IWorkTask, TaskTypeName } from '@/ts/core';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import { Spin, message } from 'antd';
import TagsBar from './tagsBar';
import { loadFileMenus } from '@/executor/fileOperate';
import { cleanMenus } from '@/utils/tools';

interface IProps {
  current: IBelong | 'disk';
}
/**
 * 办事-待办系统
 */
const Directory: React.FC<IProps> = (props) => {
  if (!props.current) return <></>;
  const [loaded, setLoaded] = useState(true);
  const [content, setContent] = useState<IFile[]>([]);
  const [currentTag, setCurrentTag] = useStorage<TaskTypeName>('taskType', '待办事项');
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const [focusFile, setFocusFile] = useState<IFile>();
  useEffect(() => {
    const id = orgCtrl.work.notity.subscribe(() => loadContent());
    return () => {
      orgCtrl.work.notity.unsubscribe(id);
    };
  }, [props.current]);
  useEffect(() => {
    loadContent();
  }, [currentTag]);

  const contextMenu = (file?: IFile, clicked?: Function) => {
    return {
      items: cleanMenus(loadFileMenus(file)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, file);
        clicked?.apply(this, []);
      },
    };
  };

  const fileOpen = async (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick && file) {
      if (!file.groupTags.includes('已删除')) {
        command.emitter('executor', 'open', file);
      }
    } else if (!dblclick) {
      if (file?.id === focusFile?.id) {
        setFocusFile(undefined);
        command.emitter('preview', 'open');
      } else {
        setFocusFile(file);
        command.emitter('preview', 'open', file);
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
    if (tag === '待办事项') {
      return orgCtrl.work.todos.filter(currentFilter).length;
    }
    return 0;
  };

  const loadContent = () => {
    setLoaded(false);
    orgCtrl.work
      .loadContent(currentTag)
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
    <>
      <TagsBar
        select={currentTag}
        initTags={['待办事项', '已办事项', '抄送我的', '我发起的']}
        badgeCount={(tag) => getBadgeCount(tag)}
        onChanged={(t) => setCurrentTag(t as TaskTypeName)}></TagsBar>
      <SegmentContent
        onSegmentChanged={setSegmented}
        descriptions={`${content.length}个项目`}
        content={
          <Spin spinning={!loaded} delay={10} tip={'加载中...'}>
            {segmented === 'table' ? (
              <TableMode
                selectFiles={[]}
                focusFile={focusFile}
                content={content}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : segmented === 'icon' ? (
              <IconMode
                selectFiles={[]}
                focusFile={focusFile}
                content={content}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : (
              <ListMode
                selectFiles={[]}
                focusFile={focusFile}
                content={content}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            )}
          </Spin>
        }
      />
    </>
  );
};
export default Directory;
