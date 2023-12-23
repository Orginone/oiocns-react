import React from 'react';
import Content from './content';
import AppLayout from '@/components/MainLayout/appLayout';
/** 文件浏览器 */
const FileBrowser: React.FC = () => {
  return (
    <AppLayout previewFlag={'store'}>
      <Content />
    </AppLayout>
  );
};

export default FileBrowser;
