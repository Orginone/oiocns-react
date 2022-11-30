import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FolderAddFilled } from '@ant-design/icons';
import { ImRedo, ImFilesEmpty, ImDownload, ImSpinner9, ImUpload } from 'react-icons/im';

const downFile = (el: any) => {
  if (el.target.thumbnail?.length > 0) {
    return '/orginone/anydata/bucket/load/' + el.target.shareLink;
  }
  return '';
};
export const getItemMenu = (el: any, isTree?: boolean) => {
  const main = [
    {
      key: '刷新',
      icon: (
        <a>
          <ImSpinner9 />
        </a>
      ),
      label: '刷新',
    },

    {
      key: '新建文件夹',
      icon: (
        <a>
          <FolderAddFilled />
        </a>
      ),
      label: '新建文件夹',
    },
  ];
  const copy = [
    {
      key: '4',
      icon: (
        <a>
          <ImFilesEmpty />
        </a>
      ),
      label: '复制到',
    },
  ];
  if (el.key === '') {
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
  } else if (el.key === '主目录') {
    return isTree ? [...main, ...copy] : copy;
  } else {
    const menus = [
      {
        key: '2',
        icon: (
          <a>
            <FaEdit />
          </a>
        ),
        label: `重命名`,
      },
      {
        key: '3',
        icon: (
          <a>
            <ImRedo />
          </a>
        ),
        label: '移动到',
      },
      ...copy,
      {
        key: '1',
        icon: (
          <a>
            <FaTrashAlt />
          </a>
        ),
        label: '删除',
      },
      {
        key: '5',
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
    return isTree ? [...menus] : menus;
  }
};
