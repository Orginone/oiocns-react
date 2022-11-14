import './index.module.less';

import { Button } from 'antd';
import React from 'react';
interface CreatShopType {
  props: []; //props
}
const Index: React.FC<CreatShopType> = ({ props }) => {
  console.log('打印index', props);

  return (
    <>
      <Button>按钮</Button>
    </>
  );
};

export default Index;
