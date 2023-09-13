import React from 'react';
import MonacoEditor from './../../monacor';
import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';

export interface IProps {
  current: ITransfer;
  node: model.RequestNode;
}

const Body: React.FC<IProps> = ({ current, node }) => {
  return (
    <MonacoEditor
      style={{ margin: 4 }}
      defaultValue={node.data.content}
      onChange={(value) => {
        node.data.content = value ?? '';
        current.updNode(node);
      }}
    />
  );
};

export default Body;
