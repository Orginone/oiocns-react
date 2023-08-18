import React from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import HotTableView from './components/hotTable';
// import ToolBar from './components/tool';
import cls from './index.module.less';
import { IReport } from '@/ts/core';

interface IProps {
  current: IReport;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title="报表"
      footer={[]}
      onCancel={finished}
    >
      <div className={cls['report-content-box']}>
        <HotTableView current={current}></HotTableView>
      </div>
    </FullScreenModal>
  );
};
export default ReportView;
