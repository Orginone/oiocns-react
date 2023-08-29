import React from 'react';
import { Button } from 'antd';

interface FormSettingType {}
/* 表单配置文件 */
const FormSetting: React.FC<FormSettingType> = () => {
  console.log('打印FormSetting');

  return (
    <>
      <Button>表单配置文件</Button>
    </>
  );
};

export default React.memo(FormSetting);
