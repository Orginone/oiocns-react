import React, { ReactNode, useEffect, useState } from 'react';
import IconMode from './iconMode';
import ListMode from './listMode';
import VListMode from './vlistMode';
import useStorage from '@/hooks/useStorage';
import SegmentContent from '@/components/Common/SegmentContent';
import { IDEntity } from '@/ts/core';
import { MenuProps } from 'antd';
import TagsBar from '../tagsBar';
import SearchBar from '../searchBar';

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
  rightBars?: ReactNode;
  height?: number | string;
  badgeCount?: (tag: string) => number;
  tagChanged?: (tag: string) => void;
  fileOpen: (file: IDEntity | undefined, dblclick: boolean) => void;
  contextMenu: (file?: IDEntity) => MenuProps;
}
/**
 * 存储-文件系统
 */
const DirectoryView: React.FC<IProps> = (props) => {
  const [filterText, setFilter] = useState<string>('');
  const [currentTag, setCurrentTag] = useState(
    props.initTags.length > 0 ? props.initTags[0] : '',
  );
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  if (props.tagChanged) {
    useEffect(() => {
      props.tagChanged?.apply(this, [currentTag]);
    }, [currentTag]);
  }
  const getContent = (filter: boolean = true) => {
    const filterExp = (file: IDEntity) => {
      return (
        file.code?.includes(filterText) ||
        file.name.includes(filterText) ||
        file.remark.includes(filterText) ||
        file.typeName.includes(filterText) ||
        file.groupTags.filter((i) => i.includes(filterText)).length > 0
      );
    };
    if (props.extraTags) {
      if (filter && currentTag == '已选中') {
        return props.selectFiles.filter(filterExp);
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
      return props.content.filter(filterExp).filter(tagFilter);
    }
    return props.content.filter(filterExp);
  };

  const RenderListMode: React.FC<{ content: IDEntity[] }> = ({ content }) => {
    if (content.length > 500) {
      return (
        <VListMode
          selectFiles={props.selectFiles}
          focusFile={props.focusFile}
          content={getContent()}
          fileOpen={props.fileOpen}
          contextMenu={props.contextMenu}
        />
      );
    } else {
      return (
        <ListMode
          selectFiles={props.selectFiles}
          focusFile={props.focusFile}
          content={getContent()}
          fileOpen={props.fileOpen}
          contextMenu={props.contextMenu}
        />
      );
    }
  };

  return (
    <>
      <SearchBar
        value={filterText}
        rightBars={props.rightBars}
        onValueChanged={(value) => setFilter(value)}
        menus={props.contextMenu()}
      />
      <TagsBar
        select={currentTag}
        showBack={props.preDirectory != undefined}
        extraTags={props.extraTags}
        excludeTags={props.excludeTags || []}
        initTags={props.initTags}
        selectFiles={props.selectFiles}
        entitys={getContent(false)}
        badgeCount={props.badgeCount}
        onBack={() => props.fileOpen(props.preDirectory, true)}
        onChanged={(t) => setCurrentTag(t)}></TagsBar>
      <SegmentContent
        height={props.height}
        onSegmentChanged={setSegmented}
        descriptions={`${getContent().length}个项目`}>
        {segmented === 'icon' ? (
          <IconMode
            selectFiles={props.selectFiles}
            focusFile={props.focusFile}
            content={getContent()}
            fileOpen={props.fileOpen}
            contextMenu={props.contextMenu}
          />
        ) : (
          <RenderListMode content={getContent()} />
        )}
      </SegmentContent>
    </>
  );
};
export default DirectoryView;
