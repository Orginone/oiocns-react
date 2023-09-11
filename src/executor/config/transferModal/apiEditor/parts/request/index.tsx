import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Body from './widgets/body';
import Headers from './widgets/headers';
import Params from './widgets/params';
import { ILink } from '@/ts/core/thing/link';
import { model } from '@/ts/base';
interface IProps {
  current: ILink;
  node: model.RequestNode;
}

const RequestPart: React.FC<IProps> = ({ current, node }) => {
  const [curTab, setCurTab] = useState<string>('Param');
  const keys: { [key in string]: () => React.ReactNode } = {
    Param: () => <Params current={current} node={node} />,
    Header: () => <Headers current={current} node={node} />,
    Body: () => <Body current={current} node={node} />,
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
