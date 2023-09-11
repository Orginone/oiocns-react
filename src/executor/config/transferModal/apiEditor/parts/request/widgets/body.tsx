import React from 'react';
import MonacoEditor from './../../monacor';
import { model } from '@/ts/base';
import { ILink } from '@/ts/core/thing/link';

export interface IProps {
  current: ILink;
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
