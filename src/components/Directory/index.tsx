import React, { useRef } from 'react';
import style from './index.module.less';
import { Segmented, Card, Space, Divider, Typography, Affix } from 'antd';
import useSessionStorage from '@/hooks/useSessionStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import * as fa from 'react-icons/fa';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IDirectory } from '@/ts/core';

interface IProps {
  mode: number;
  current: IDirectory | undefined;
}
type segmentedTypes = 'icon' | 'table' | 'list';
/**
 * 存储-文件系统
 */
const Directory: React.FC<IProps> = ({ mode, current }: IProps) => {
  if (!current) return <></>;
  const [key] = useCtrlUpdate(current);
  const [segmented, setSegmented] = useSessionStorage('segmented', 'icon');
  const parentRef = useRef<any>();

  return (
    <Card id={key} className={style.pageCard} bordered={false}>
      <div className={style.mainContent} ref={parentRef}>
        {segmented === 'table' ? (
          <TableMode current={current} mode={mode} />
        ) : segmented === 'icon' ? (
          <IconMode current={current} mode={mode} />
        ) : (
          <ListMode current={current} mode={mode} />
        )}
      </div>
      <Affix style={{ position: 'absolute', right: 10, bottom: 0 }}>
        <Segmented
          value={segmented}
          onChange={(value) => setSegmented(value as segmentedTypes)}
          options={[
            {
              value: 'list',
              icon: (
                <fa.FaList
                  fontSize={20}
                  color={segmented === 'list' ? 'blue' : '#9498df'}
                />
              ),
            },
            {
              value: 'icon',
              icon: (
                <fa.FaTh
                  fontSize={20}
                  color={segmented === 'icon' ? 'blue' : '#9498df'}
                />
              ),
            },
            {
              value: 'table',
              icon: (
                <fa.FaTable
                  fontSize={20}
                  color={segmented === 'table' ? 'blue' : '#9498df'}
                />
              ),
            },
          ]}
        />
      </Affix>
      <Affix style={{ position: 'absolute', left: 10, bottom: 0 }}>
        <Space split={<Divider type="vertical" />}>
          <Typography.Link>{current.content(mode).length}个项目</Typography.Link>
        </Space>
      </Affix>
    </Card>
  );
};
export default Directory;
