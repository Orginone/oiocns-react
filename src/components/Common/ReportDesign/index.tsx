import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import HotTableView from './components/hotTable';
import ToolBar from './components/tool';
import cls from './index.module.less';
import { IForm } from '@/ts/core';

interface IProps {
  current: IForm;
  selectItem: any;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, selectItem, finished }) => {
  console.log(selectItem, 'selectItem');
  const [reportChange, setReportChange] = useState<any>();
  const [changeType, setChangeType] = useState<string>('');
  const [classType, setClassType] = useState<string>('');
  const handClick = (value: any, type: string, classType: string) => {
    // console.log(value, type, classType)
    setReportChange(value);
    setChangeType(type);
    setClassType(classType);
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title="报表"
      footer={[]}
      onCancel={finished}>
      <div className={cls['report-content-box']}>
        <div className={cls['report-tool-box']}>
          <ToolBar handClick={handClick}></ToolBar>
        </div>
        <HotTableView
          current={current}
          selectItem={selectItem}
          reportChange={reportChange}
          changeType={changeType}
          classType={classType}></HotTableView>
      </div>
    </FullScreenModal>
  );
};
export default ReportView;
