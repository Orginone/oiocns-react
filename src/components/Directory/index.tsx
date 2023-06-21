import React, { useRef } from 'react';
import style from './index.module.less';
import { Segmented, Card } from 'antd';
import useSessionStorage from '@/hooks/useSessionStorage';
import IconMode from './views/iconMode';
import TableMode from './views/tableMode';
import * as fa from 'react-icons/fa';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IDirectory } from '@/ts/core';

interface IProps {
  mode: number;
  current: IDirectory | undefined;
}
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = ({ mode, current }: IProps) => {
  if (!current) return <></>;
  const [key] = useCtrlUpdate(current);
  const [segmented, setSegmented] = useSessionStorage('segmented', 'Kanban');
  const parentRef = useRef<any>();

  return (
    <Card id={key} className={style.pageCard} bordered={false}>
      <div className={style.mainContent} ref={parentRef}>
        {segmented === 'List' ? (
          <TableMode current={current} mode={mode} />
        ) : (
          <IconMode current={current} mode={mode} />
        )}
      </div>
      <Segmented
        value={segmented}
        onChange={(value) => setSegmented(value as 'Kanban' | 'List')}
        options={[
          {
            value: 'List',
            icon: (
              <fa.FaTable
                fontSize={20}
                color={segmented === 'List' ? 'blue' : '#9498df'}
              />
            ),
          },
          {
            value: 'Kanban',
            icon: (
              <fa.FaTh
                fontSize={20}
                color={segmented === 'Kanban' ? 'blue' : '#9498df'}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};
export default Directory;
