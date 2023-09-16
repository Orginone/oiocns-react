import { ITransfer } from '@/ts/core';
import React, { ReactNode, useEffect, useState } from 'react';
import RequestModal from './../../../apiEditor/layout';
import MappingModal from './../../../mapper/parts/modal';

interface IProps {
  current: ITransfer;
}

const Editable: React.FC<IProps> = ({ current }) => {
  const [center, setCenter] = useState<ReactNode>();
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type != 'tools') return;
      switch (cmd) {
        case 'edit':
          switch (args.typeName) {
            case '请求':
              setCenter(
                <RequestModal
                  finished={() => setCenter(<></>)}
                  transfer={current}
                  current={args}
                />,
              );
              break;
            case '映射':
              setCenter(
                <MappingModal
                  finished={() => setCenter(<></>)}
                  link={current}
                  current={args}
                />,
              );
              break;
          }
          break;
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return <>{center}</>;
};

export default Editable;
