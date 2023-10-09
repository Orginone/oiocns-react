import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import Body from './body';
import Headers from './headers';
import Params from './params';

interface IProps {
  transfer: ITransfer;
  current: model.Request;
}

const HttpData: React.FC<IProps> = ({ transfer, current }) => {
  const [curTab, setCurTab] = useState<string>('Param');
  // eslint-disable-next-line no-unused-vars
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
      {keys[curTab]()}
    </>
  );
};

export default HttpData;
