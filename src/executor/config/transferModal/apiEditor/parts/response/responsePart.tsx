import { ITransfer } from '@/ts/core';
import React from 'react';
import MonacoEditor from '../monacor';

interface IProps {
  transfer: ITransfer;
}

const ResponsePart: React.FC<IProps> = ({ transfer }) => {
  return (
    <MonacoEditor
      cmd={transfer.command}
      style={{ margin: 10 }}
      options={{ readOnly: true }}
    />
  );
};

export default ResponsePart;
