import React from 'react';
import { Divider } from 'antd';
type props = {
  schema: {
    dashed: boolean;
    children: string;
  };
};
const MyDivider = (props: props) => {
  const { schema } = props;
  const { dashed } = schema;
  return <Divider dashed={dashed}>{schema.children}</Divider>;
};

export default MyDivider;
