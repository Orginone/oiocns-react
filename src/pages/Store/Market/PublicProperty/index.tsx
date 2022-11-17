import { Button } from 'antd';
import React from 'react';
interface indexType {
  props: []; //props
}
const Index: React.FC<indexType> = ({ props }) => {
  console.log('打印index', props);

  return (
    <>
      <Button>公物仓</Button>
    </>
  );
};

export default Index;
