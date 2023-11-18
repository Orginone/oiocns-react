import React, { useEffect, useState } from 'react';
import IconMode from './iconMode';
import ListMode from './listMode';
import useStorage from '@/hooks/useStorage';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDEntity } from '@/ts/core';
import { MenuProps } from 'antd';
import TagsBar from '../tagsBar';

interface IProps {
  content: IDEntity[];
  accepts?: string[];
  selectFiles: IDEntity[];
  excludeIds?: string[];
  initTags: string[];
  extraTags: boolean;
  excludeTags?: string[];
  preDirectory?: IDEntity;
  focusFile?: IDEntity;
  badgeCount?: (tag: string) => number;
  tagChanged?: (tag: string) => void;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => MenuProps;
}
/**
 * 存储-文件系统
 */
const DirectoryView: React.FC<IProps> = (props) => {
  const [currentTag, setCurrentTag] = useState(
    props.initTags.length > 0 ? props.initTags[0] : '',
  );
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  useEffect(() => {
    if (props.initTags.length > 0 && !props.initTags.includes(currentTag)) {
      setCurrentTag(props.initTags[0]);
    }
  }, [props]);
  if (props.tagChanged) {
    useEffect(() => {
      props.tagChanged?.apply(this, [currentTag]);
    }, [currentTag]);
  }
  const getContent = (filter: boolean = true) => {
    if (props.extraTags) {
      if (filter && currentTag == '已选中') {
        return props.selectFiles;
      }
      const tagFilter = (file: IDEntity) => {
        let success = true;
        if (props.excludeIds && props.excludeIds.length > 0) {
          success = !props.excludeIds.includes(file.id);
        }
        if (filter && success) {
          if (currentTag !== '全部' && currentTag != '最近') {
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
      return props.content.filter(tagFilter);
    }
    return props.content;
  };
  return (
    <>
      <TagsBar
        select={currentTag}
        showBack={props.preDirectory != undefined}
        extraTags={props.extraTags}
        excludeTags={props.excludeTags || []}
        initTags={props.initTags}
        selectFiles={props.selectFiles}
        entitys={getContent(false)}
        badgeCount={props.badgeCount}
        menus={props.contextMenu()}
        onBack={() => props.fileOpen(props.preDirectory, true)}
        onChanged={(t) => setCurrentTag(t)}></TagsBar>
      <SegmentContent
        onSegmentChanged={setSegmented}
        descriptions={`${getContent().length}个项目`}
        content={
          segmented === 'icon' ? (
            <IconMode
              selectFiles={props.selectFiles}
              focusFile={props.focusFile}
              content={getContent()}
              fileOpen={props.fileOpen}
              contextMenu={props.contextMenu}
            />
          ) : (
            <ListMode
              selectFiles={props.selectFiles}
              focusFile={props.focusFile}
              content={getContent()}
              fileOpen={props.fileOpen}
              contextMenu={props.contextMenu}
            />
          )
        }
      />
    </>
  );
};
export default DirectoryView;
