import { ILink } from '@/ts/core/thing/link';
import React from 'react';
import MonacoEditor from '../monacor';

interface IProps {
  current: ILink;
}

const ResponsePart: React.FC<IProps> = ({ current }) => {
  return (
    <MonacoEditor
      cmd={current.command}
      style={{ margin: 10 }}
      options={{ readOnly: true }}
    />
  );
};

export default ResponsePart;
