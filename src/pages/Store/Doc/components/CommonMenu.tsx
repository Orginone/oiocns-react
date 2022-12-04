import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ImFolder, ImFolderOpen, ImFolderPlus } from 'react-icons/im';
import { ImRedo, ImFilesEmpty, ImDownload, ImSpinner9, ImUpload } from 'react-icons/im';
import { FileItemModel } from '@/ts/base/model';
type NullFileItemModel = FileItemModel | undefined;

const downFile = (el: NullFileItemModel) => {
  if (el && el.thumbnail?.length > 0) {
    return '/orginone/anydata/bucket/load/' + el.shareLink;
  }
  return '';
};
export const getItemMenu = (el: NullFileItemModel, isTree?: boolean) => {
  const main = [
    {
      key: '新建文件夹',
      icon: (
        <a>
          <ImFolderPlus />
        </a>
      ),
      label: '新建文件夹',
    },
    {
      key: '刷新',
      icon: (
        <a>
          <ImSpinner9 />
        </a>
      ),
      label: '刷新',
    },
  ];
  const copy = [
    {
      key: '复制到',
      icon: (
        <a>
          <ImFilesEmpty />
        </a>
      ),
      label: '复制到',
    },
  ];
  if (el) {
    if (el.key === '主目录' || el.key === '') {
      return isTree ? [...main, ...copy] : copy;
    } else {
      const menus = [
        {
          key: '重命名',
          icon: (
            <a>
              <FaEdit />
            </a>
          ),
          label: `重命名`,
        },
        {
          key: '移动到',
          icon: (
            <a>
              <ImRedo />
            </a>
          ),
          label: '移动到',
        },
        ...copy,
        {
          key: '删除',
          icon: (
            <a>
              <FaTrashAlt />
            </a>
          ),
          label: '删除',
        },
        {
          key: '下载',
          icon: (
            <a>
              <ImDownload />
            </a>
          ),
          label: downFile(el) ? (
            <a target="_blank" href={downFile(el)} rel="noreferrer">
              下载
            </a>
          ) : (
            '下载'
          ),
        },
      ];
      return isTree ? [...main, ...menus] : menus;
    }
  }
  return isTree
    ? main
    : [
        main[0],
        {
          key: '上传',
          icon: (
            <a>
              <ImUpload />
            </a>
          ),
          label: '上传',
        },
        main[1],
      ];
};

export const getIcon = (props: {
  expanded: boolean;
  selected: boolean;
  isLeaf: boolean;
}) => {
  // eslint-disable-next-line react/prop-types
  const { expanded, selected, isLeaf } = props;
  return expanded || (selected && isLeaf) ? (
    <ImFolderOpen color="#c09553" />
  ) : (
    <ImFolder color="#c09553" />
  );
};
