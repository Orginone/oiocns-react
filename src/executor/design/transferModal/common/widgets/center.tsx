import { ITransfer } from '@/ts/core';
import React, { ReactNode, useEffect, useState } from 'react';
import { model } from '@/ts/base';
import { MappingModal, RequestModal, StoreModal, TransferModal } from '../..';
import OfficeView from '@/executor/open/office';
import { message } from 'antd';

interface IProps {
  current: ITransfer;
}

const Editable: React.FC<IProps> = ({ current }) => {
  const [center, setCenter] = useState<ReactNode>();
  const setEmpty = () => setCenter(<></>);
  useEffect(() => {
    const id = current.command.subscribe(async (type, cmd, args) => {
      if (type != 'tools') return;
      switch (cmd) {
        case 'edit':
          switch (args.typeName) {
            case '请求':
              setCenter(
                <RequestModal finished={setEmpty} transfer={current} current={args} />,
              );
              break;
            case '映射':
              setCenter(
                <MappingModal finished={setEmpty} transfer={current} current={args} />,
              );
              break;
            case '存储':
              setCenter(
                <StoreModal finished={setEmpty} transfer={current} current={args} />,
              );
              break;
            case '子图':
              {
                const subTransfer = args as model.SubTransfer;
                const nextId = subTransfer.nextId;
                const nextTransfer = current.getTransfer(nextId);
                setCenter(
                  <>
                    {nextTransfer && (
                      <TransferModal current={nextTransfer} finished={setEmpty} />
                    )}
                  </>,
                );
              }
              break;
            case '表格':
              {
                const tables = args as model.Tables;
                if (tables.file) {
                  setCenter(<OfficeView share={tables.file} finished={setEmpty} />);
                } else {
                  message.error('未上传文件');
                }
              }
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
