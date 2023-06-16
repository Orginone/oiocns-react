import React, { useRef } from 'react';
import style from './index.module.less';
import { Segmented, Card } from 'antd';
import useSessionStorage from '@/hooks/useSessionStorage';
import TableContent from './components/TableContent';
import CardListContent from './components/CardContent';
import { IconFont } from '@/components/IconFont';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IDirectory, IFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import TypeIcon from '@/bizcomponents/GlobalComps/typeIcon';

interface IProps {
  current: IDirectory | undefined;
}
/**
 * 存储-文件系统
 */
const SettingContent: React.FC<IProps> = ({ current }: IProps) => {
  if (!current) return <></>;
  const [key] = useCtrlUpdate(current);
  const [segmented, setSegmented] = useSessionStorage('segmented', 'Kanban');
  const parentRef = useRef<any>();

  /** 操作到Menus */
  const loadMenus = (file: IFileInfo<schema.XEntity>, mode: number = 0) => {
    return file.operates(mode).map((o) => {
      return {
        key: o.cmd,
        label: o.label,
        icon: o.menus ? <></> : <TypeIcon iconType={o.iconType} size={16} />,
        children: o.menus?.map((s) => {
          return {
            key: s.cmd,
            label: s.label,
            icon: <TypeIcon iconType={s.iconType} size={16} />,
          };
        }),
      };
    });
  };

  return (
    <Card id={key} className={style.pageCard} bordered={false}>
      <div className={style.mainContent} ref={parentRef}>
        {segmented === 'List' ? (
          <TableContent
            key={key}
            parentRef={parentRef}
            pageData={current.content()}
            loadMenus={loadMenus}
          />
        ) : (
          <CardListContent current={current} loadMenus={loadMenus} />
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
export default SettingContent;
