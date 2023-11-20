import React, { useEffect, useState } from 'react';
import { IFile } from '@/ts/core';
import { command } from '@/ts/base';
import DirectoryViewer from '@/components/Directory/views';
import { loadFileMenus } from '@/executor/fileOperate';
/**
 * @description: 默认目录
 * @return {*}
 */
const Directory: React.FC<{ root: IFile }> = ({ root }) => {
  const [preDirectory, setPreDirectory] = useState<IFile>();
  const [directory, setDirectory] = useState<IFile>(root);
  const [content, setContent] = useState(directory.content(false));
  useEffect(() => {
    directory.loadContent().then(() => {
      setContent(directory.content(false));
    });
    if (directory != root) {
      setPreDirectory(directory.superior);
    } else {
      setPreDirectory(undefined);
    }
  }, [directory]);
  return (
    <DirectoryViewer
      extraTags
      initTags={['全部']}
      selectFiles={[]}
      content={content}
      fileOpen={(file) => {
        if (file && 'isContainer' in file && file.isContainer) {
          setDirectory(file as IFile);
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
export default Directory;
