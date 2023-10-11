import React, { useState } from 'react';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDirectory, IFile } from '@/ts/core';
import { loadFileMenus } from '@/executor/fileOperate';
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';
import TagsBar from './tagsBar';

interface IProps {
  mode: number;
  accepts?: string[];
  selects?: IFile[];
  excludeIds?: string[];
  onFocused?: (file: IFile | undefined) => void;
  onSelected?: (files: IFile[]) => void;
  current: IDirectory | undefined | 'disk';
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
  const [currentTag, setCurrentTag] = useState('全部');
  const [loaded] = useAsyncLoad(() => dircetory.loadContent());
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const [focusFile, setFocusFile] = useState<IFile>();
  const contextMenu = (file?: IFile, clicked?: Function) => {
    var entity = file || dircetory;
    if ('targets' in entity) {
      entity = entity.directory;
    }
    return {
      items: loadFileMenus(entity, props.mode),
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, file || dircetory, dircetory.key);
        clicked?.apply(this, []);
      },
    };
  };

  const fileOpen = async (file: IFile | undefined, dblclick: boolean) => {
    if (dblclick && file && props.mode < 10) {
      if (!file.groupTags.includes('已删除')) {
        command.emitter('executor', 'open', file);
      }
    } else if (!dblclick) {
      if (file?.id === focusFile?.id) {
        setFocusFile(undefined);
        props.onFocused?.apply(this, [undefined]);
        if (props.selects && props.selects.length > 0 && file) {
          props.onSelected?.apply(this, [props.selects.filter((i) => i.id !== file.id)]);
        }
        command.emitter('preview', 'open');
      } else {
        setFocusFile(file);
        props.onFocused?.apply(this, [file]);
        if (props.selects && file) {
          if (file && props.selects.every((i) => i.id !== file.id)) {
            props.onSelected?.apply(this, [[...props.selects, file]]);
          }
        }
        command.emitter('preview', 'open', file);
      }
    }
  };

  const getContent = (filter: boolean = true) => {
    if (filter && currentTag == '已选中') {
      return props.selects || [];
    }
    const contents: IFile[] = [];
    if (props.current === 'disk') {
      contents.push(orgCtrl.user, ...orgCtrl.user.companys);
    } else {
      contents.push(...props.current!.content(props.mode));
    }
    const tagFilter = (file: IFile) => {
      let success = true;
      if (props.excludeIds && props.excludeIds.length > 0) {
        success = !props.excludeIds.includes(file.id);
      }
      if (filter) {
        if (currentTag !== '全部') {
          success = file.groupTags.includes(currentTag);
        } else {
          success = !file.groupTags.includes('已删除');
        }
      }
      if (success && props.accepts && props.accepts.length > 0) {
        success = file.groupTags.some((i) => props.accepts!.includes(i));
      }
      return success;
    };
    return contents.filter(tagFilter);
  };

  return (
    <>
      <TagsBar
        select={currentTag}
        initTags={['全部']}
        selectFiles={props.selects || []}
        entitys={getContent(false)}
        onChanged={(t) => setCurrentTag(t)}></TagsBar>
      <SegmentContent
        key={key}
        onSegmentChanged={setSegmented}
        descriptions={`${getContent().length}个项目`}
        content={
          <Spin spinning={!loaded} delay={10} tip={'加载中...'}>
            {segmented === 'table' ? (
              <TableMode
                selectFiles={props.selects || []}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : segmented === 'icon' ? (
              <IconMode
                selectFiles={props.selects || []}
                focusFile={focusFile}
                content={getContent()}
                fileOpen={fileOpen}
                contextMenu={contextMenu}
              />
            ) : (
              <ListMode
                selectFiles={props.selects || []}
                focusFile={focusFile}
                content={getContent()}
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
