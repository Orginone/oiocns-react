import React from 'react';
import MyDivider from './widgets/Divider';
import MySpace from './widgets/Space';
import Form, { FRProps } from 'form-render';
const FormRender = (props: React.JSX.IntrinsicAttributes & FRProps) => {
  return <Form widgets={{ MyDivider: MyDivider, MySpace: MySpace }} {...props} />;
};

export default FormRender;
