import React, { useRef, useState } from 'react';
import style from './index.module.less';
import { Segmented, Card } from 'antd';
import useSessionStorage from '@/hooks/useSessionStorage';
import orgCtrl from '@/ts/controller';
import TableContent from './components/TableContent';
import CardListContent from './components/CardContent';
import { IconFont } from '@/components/IconFont';
import { FileItemModel } from '@/ts/base/model';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import FileSysOperate from '../../components/FileSysOperate';
import { IFileSystemItem } from '@/ts/core/target/store/ifilesys';

interface IProps {
  current: IFileSystemItem;
}
/**
 * 仓库-文件系统
 */
const FileSystem: React.FC<IProps> = ({ current }: IProps) => {
  const [key] = useCtrlUpdate(orgCtrl);
  const [operateKey, setOperateKey] = useState<string>();
  const [operateTarget, setOperateTarget] = useState<IFileSystemItem>();
  const [segmented, setSegmented] = useSessionStorage('segmented', 'Kanban');
  const parentRef = useRef<any>();

  const getThumbnail = (item: FileItemModel) => {
    if (item.thumbnail.length > 0) {
      return item.thumbnail;
    }
    if (item.extension === '') {
      return '/icons/default_folder.svg';
    }
    return `/icons/file_type_${item.extension.replace('.', '')}.svg`;
  };

  return (
    <Card id={key} className={style.pageCard} bordered={false}>
      <div className={style.mainContent} ref={parentRef}>
        {segmented === 'List' ? (
          <TableContent
            key={key}
            parentRef={parentRef}
            pageData={current.children}
            getThumbnail={getThumbnail}
            handleMenuClick={(key, target) => {
              setOperateKey(key);
              setOperateTarget(target);
            }}
          />
        ) : (
          <CardListContent
            current={current}
            getThumbnail={getThumbnail}
            handleMenuClick={(key, target) => {
              setOperateKey(key);
              setOperateTarget(target);
            }}
          />
        )}
      </div>
      <Segmented
        value={segmented}
        onChange={(value) => setSegmented(value as 'Kanban' | 'List')}
        options={[
          {
            value: 'List',
            icon: (
              <IconFont
                type={'icon-chuangdanwei'}
                className={segmented === 'List' ? style.active : ''}
              />
            ),
          },
          {
            value: 'Kanban',
            icon: (
              <IconFont
                type={'icon-jianyingyong'}
                className={segmented === 'Kanban' ? style.active : ''}
              />
            ),
          },
        ]}
      />
      <FileSysOperate
        operateKey={operateKey}
        operateTarget={operateTarget}
        operateDone={() => {
          setOperateKey(undefined);
          setOperateTarget(undefined);
        }}
      />
    </Card>
  );
};
export default FileSystem;
