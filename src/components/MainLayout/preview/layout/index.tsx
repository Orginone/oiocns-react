import { List, Tag } from 'antd';
import React from 'react';
import css from './index.module.less';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import { IDEntity, ISession } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

interface IProps {
  entity: IDEntity | ISession;
  actions?: {
    key: string;
    label: string;
  }[];
  selectKey?: string;
  number?: number;
  children?: React.ReactNode; // 子组件
  onActionChanged?: (key: string) => void;
}

const PreviewLayout: React.FC<IProps> = (props) => {
  const nameNumber = props.number ?? 0;
  return (
    <>
      <div className={css.groupDetail}>
        <List.Item
          className={css.header}
          actions={props.actions?.map((action) => {
            const selected = action.key === props.selectKey;
            return (
              <a
                key={action.key}
                title={action.label}
                onClick={() => {
                  if (props.onActionChanged) {
                    props.onActionChanged(action.key);
                  }
                }}>
                <OrgIcons type={action.key} selected={selected} size={26} />
              </a>
            );
          })}>
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 10 }}>{props.entity.name}</span>
                {nameNumber > 0 && <span className={css.number}>({nameNumber})</span>}
              </>
            }
            avatar={<EntityIcon entity={props.entity.metadata} size={50} />}
            description={props.entity.groupTags
              .filter((i) => i.length > 0)
              .map((label) => {
                return (
                  <Tag key={label} color={'success'}>
                    {label}
                  </Tag>
                );
              })}
          />
        </List.Item>
        <div
          style={{
            height: 'calc(100vh - 105px)',
            overflow: 'scroll',
          }}
          className={css.groupDetailContent}>
          {props.children && props.children}
        </div>
      </div>
    </>
  );
};

export default PreviewLayout;
