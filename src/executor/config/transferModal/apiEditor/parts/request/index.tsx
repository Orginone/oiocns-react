import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import Body from './widgets/body';
import Headers from './widgets/headers';
import Params from './widgets/params';

interface IProps {
  transfer: ITransfer;
  current: model.RequestNode;
}

const RequestPart: React.FC<IProps> = ({ transfer, current }) => {
  const [curTab, setCurTab] = useState<string>('Param');
  const keys: { [key in string]: () => React.ReactNode } = {
    Param: () => <Params transfer={transfer} current={current} />,
    Header: () => <Headers transfer={transfer} current={current} />,
    Body: () => <Body current={transfer} node={current} />,
  };
  return (
    <>
      <Tabs
        onChange={setCurTab}
        items={Object.keys(keys).map((key) => {
          return {
            key: key,
            label: key,
          };
        })}
      />
      <div style={{ height: '100%' }}>{keys[curTab]()}</div>
    </>
  );
};

export default RequestPart;
