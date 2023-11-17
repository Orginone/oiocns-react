import React, { useEffect, useState } from 'react';
import { IFile, ITarget } from '@/ts/core';
import { command } from '@/ts/base';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
/**
 * @description: 群目录
 * @return {*}
 */
const Store: React.FC<{ target: ITarget }> = ({ target }) => {
  const [preDirectory, setPreDirectory] = useState<any>();
  const [directory, setDirectory] = useState<any>(target.directory);
  const [content, setContent] = useState(directory.content(false));
  useEffect(() => {
    directory.loadContent().then(() => {
      setContent(directory.content(false));
    });
    setPreDirectory(directory.parent);
    if (directory.parent === undefined && 'works' in directory) {
      setPreDirectory(directory.directory);
    }
  }, [directory]);
  return (
    <DirectoryViewer
      extraTags
      initTags={['全部']}
      selectFiles={[]}
      content={content}
      fileOpen={(file: any) => {
        if (file && ('standard' in file || 'works' in file)) {
          setDirectory(file);
        } else {
          command.emitter('executor', 'open', file);
        }
      }}
      preDirectory={preDirectory}
      contextMenu={(entity) => {
        const file = (entity as IFile) || directory;
        return {
          items: loadFileMenus(file),
          onClick: ({ key }: { key: string }) => {
            command.emitter('executor', key, file);
          },
        };
      }}
    />
  );
};
export default Store;
