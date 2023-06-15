import React, { useRef } from 'react';
import style from './index.module.less';
import { Segmented, Card } from 'antd';
import useSessionStorage from '@/hooks/useSessionStorage';
import TableContent from './components/TableContent';
import CardListContent from './components/CardContent';
import { IconFont } from '@/components/IconFont';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IDirectory } from '@/ts/core';
import { command } from '@/ts/base';

interface IProps {
  current: IDirectory;
}
/**
 * 存储-文件系统
 */
const FileSystem: React.FC<IProps> = ({ current }: IProps) => {
  const [key] = useCtrlUpdate(current);
  const [segmented, setSegmented] = useSessionStorage('segmented', 'Kanban');
  const parentRef = useRef<any>();

  return (
    <Card id={key} className={style.pageCard} bordered={false}>
      <div className={style.mainContent} ref={parentRef}>
        {segmented === 'List' ? (
          <TableContent
            key={key}
            parentRef={parentRef}
            pageData={current.content()}
            handleMenuClick={(key, target) => {
              command.emitter('config', key, target);
            }}
          />
        ) : (
          <CardListContent
            current={current}
            handleMenuClick={(key, target) => {
              command.emitter('config', key, target);
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
    </Card>
  );
};
export default FileSystem;
