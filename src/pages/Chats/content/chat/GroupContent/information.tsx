import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMessage } from '@/ts/core';
import css from './index.module.less';
import { Drawer } from 'antd';
import React from 'react';

const Information = ({ msg, onClose }: { msg: IMessage; onClose: Function }) => {
  return (
    <Drawer title={'消息标记信息'} onClose={() => onClose()} closable open>
      <ul className={css.moreInfo}>
        {msg.labels.map((i) => {
          return (
            <li key={i.time}>
              <EntityIcon share={i.labeler} fontSize={30} size={30} />
              <strong style={{ marginLeft: 6 }}>{i.labeler.name}</strong>
              <div>
                <span>{i.time}:</span>
                <strong>{i.label}</strong>
              </div>
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
};
export default Information;
