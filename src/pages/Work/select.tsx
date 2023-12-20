import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { IWork } from '@/ts/core';
import DirectoryViewer from '@/components/Directory/views';
import { command } from '@/ts/base';
import { cleanMenus } from '@/utils/tools';
import { loadFileMenus } from '@/executor/fileOperate';
import { Spin } from 'antd';

/** 办事-办事库-选择 */
const WorkSelect: React.FC<{ onSelected: (work: IWork) => void }> = ({ onSelected }) => {
  const [loaded, setLoaded] = useState(false);
  const [works, setWorks] = useState<IWork[]>([]);
  const [currentTag, setCurrentTag] = useState('全部');

  useEffect(() => {
    orgCtrl.loadApplications().then(async (res) => {
      const newWorks: IWork[] = [];
      for (const item of res) {
        newWorks.push(...(await item.loadAllWorks()));
      }
      setWorks([
        ...newWorks.filter((i) => !i.cache.tags?.includes('常用') && i.isMyWork),
      ]);
      setLoaded(true);
    });
  }, []);

  const contextMenu = (work: IWork | undefined) => {
    return {
      items: cleanMenus(loadFileMenus(work)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, work);
      },
    };
  };

  const workOpen = (work: IWork | undefined) => {
    if (work) {
      work.toggleCommon().then((res) => {
        if (res) {
          onSelected(work);
        }
      });
    }
  };

  return (
    <Spin spinning={!loaded} tip={'加载中...'}>
      <DirectoryViewer
        extraTags
        height={'calc(100% - 100px)'}
        initTags={['全部']}
        selectFiles={[]}
        content={works}
        currentTag={currentTag}
        tagChanged={(t) => setCurrentTag(t)}
        fileOpen={(entity) => workOpen(entity as IWork)}
        contextMenu={(entity) => contextMenu(entity as IWork)}
      />
    </Spin>
  );
};
export default WorkSelect;
