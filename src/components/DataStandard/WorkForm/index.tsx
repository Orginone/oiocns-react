import { IForm } from '@/ts/core';
import React from 'react';
import Viewer from './Viewer';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { Spin } from 'antd';

const WorkForm: React.FC<{
  form: IForm;
}> = ({ form }) => {
  const [loaded] = useAsyncLoad(() => form.loadContent(), [form]);
  if (loaded) {
    return (
      <Viewer
        form={form.metadata}
        fields={form.fields}
        belong={form.directory.target.space}
      />
    );
  }
  return (
    <Spin tip={'信息加载中...'} spinning={!loaded}>
      <div style={{ width: '100%', height: '100%' }}></div>
    </Spin>
  );
};

export default WorkForm;
