import React, { useRef, useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IApplication, IWork } from '@/ts/core';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import style from './index.module.less';
import { Card, Segmented } from 'antd';
import useSessionStorage from '@/hooks/useSessionStorage';
import TableContent from './components/tableContent';
import CardListContent from './components/cardContent';
import { IconFont } from '@/components/IconFont';
import StartModal from './components/start';

interface IProps {
  current: IApplication;
  finished: () => void;
}

/** 应用查看 */
const FormView: React.FC<IProps> = ({ current, finished }) => {
  const parentRef = useRef<any>();
  const [applyWork, setApplyWork] = useState<IWork>();
  const [segmented, setSegmented] = useSessionStorage('segmented', 'Kanban');
  return (
    <FullScreenModal
      centered
      open={true}
      fullScreen
      width={'80vw'}
      title={current.name}
      bodyHeight={'80vh'}
      icon={<EntityIcon entityId={current.id} />}
      destroyOnClose
      onCancel={() => finished()}>
      <Card className={style.pageCard} bordered={false}>
        <div className={style.mainContent} ref={parentRef}>
          {segmented === 'List' ? (
            <TableContent
              setApplyWork={setApplyWork}
              parentRef={parentRef}
              pageData={current.works}
            />
          ) : (
            <CardListContent current={current} setApplyWork={setApplyWork} />
          )}
        </div>
        {applyWork && (
          <StartModal
            current={applyWork}
            finished={() => {
              setApplyWork(undefined);
            }}
          />
        )}
        <Segmented
          value={segmented}
          onChange={(value) => setSegmented(value as 'Kanban' | 'List')}
          options={[
            {
              value: 'List',
              icon: (
                <IconFont
                  type={'icon-chuangdanwei'}
                  className={segmented === 'List' ? style.active : ''}
                />
              ),
            },
            {
              value: 'Kanban',
              icon: (
                <IconFont
                  type={'icon-jianyingyong'}
                  className={segmented === 'Kanban' ? style.active : ''}
                />
              ),
            },
          ]}
        />
      </Card>
    </FullScreenModal>
  );
};

export default FormView;
