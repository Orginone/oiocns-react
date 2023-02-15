import React, { useState } from 'react';
import { Form, Card, Row, Col, Space, PageHeader, message, Drawer } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
interface Iprops {
  open: boolean;
  setCreateWay: Function;
}
const selectAppTemplate: React.FC<Iprops> = (props) => {
  const { open, setCreateWay } = props;
  return (
    <Drawer
      title="选择模板"
      placement={'bottom'}
      height={'90%'}
      closable={false}
      onClose={() => setCreateWay(undefined)}
      open={open}
      key={'placement-bottom'}>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};

export default selectAppTemplate;
