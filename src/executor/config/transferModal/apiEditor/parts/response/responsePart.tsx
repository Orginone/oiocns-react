import { Command } from '@/ts/base';
import React from 'react';
import MonacoEditor, { toJsonString } from '../monacor';
import { IRequest } from '@/ts/core/thing/config';

interface IProps {
  current: IRequest;
  cmd: Command;
}

const ResponsePart: React.FC<IProps> = ({ current, cmd }) => {
  return (
    <MonacoEditor
      defaultValue={toJsonString(current.resp)}
      cmd={cmd}
      style={{ margin: 10 }}
      options={{ readOnly: true }}
    />
  );
};

export default ResponsePart;
