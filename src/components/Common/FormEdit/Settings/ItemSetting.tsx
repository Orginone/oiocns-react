import React from 'react';
import { Button } from 'antd';

interface ItemSettingType {}
/* 表单项配置文件 */
const ItemSetting: React.FC<ItemSettingType> = () => {
  console.log('打印ItemSetting');

  return (
    <>
      <Button>表单项</Button>
    </>
  );
};

export default ItemSetting;
