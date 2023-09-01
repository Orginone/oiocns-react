import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Body from './widgets/body';
import Headers from './widgets/headers';
import Params from './widgets/params';
import { IRequest } from '@/ts/core/thing/config';

interface IProps {
  current: IRequest;
}

const RequestPart: React.FC<IProps> = ({ current }) => {
  const [curTab, setCurTab] = useState<string>(current.metadata.curTab ?? 'Param');
  useEffect(() => {
    const id = current.subscribe(() => {
      setCurTab(current.metadata.curTab ?? 'Param');
    });
    return () => {
      current.unsubscribe(id);
    };
  });
  const keys: { [key in string]: () => React.ReactNode } = {
    Param: () => <Params current={current} />,
    Header: () => <Headers current={current} />,
    Body: () => <Body current={current} />,
  };
  return (
    <>
      <Tabs
        activeKey={curTab}
        onChange={(activeKey: string) => {
          current.metadata.curTab = activeKey;
          current.refresh(current.metadata);
        }}
        items={Object.keys(keys).map((key) => {
          return {
            key: key,
            label: key,
          };
        })}></Tabs>
      <div style={{ height: '100%' }}>{keys[curTab]()}</div>
    </>
  );
};

export default RequestPart;
