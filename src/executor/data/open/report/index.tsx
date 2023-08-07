import React, {useState} from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import HotTableView from './components/hotTable';
import ToolBar from './components/tool';
import cls from './index.module.less';
import { IReport } from '@/ts/core';

interface IProps {
  current: IReport;
  selectItem:any;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, selectItem, finished }) => {
  console.log(current,'current',selectItem,'selectItem')
  const [reportChange,setReportChange] = useState<any>();
  const [changeType,setChangeType] = useState<string>('');
  const [modalType,setModalType] = useState<string>('');
  const handClick = (value:any,type:string) =>{
    setReportChange(value)
    setChangeType(type)
  }

  const setModal = (value:string) =>{
    setModalType(value)
  }

	return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title='报表'
      footer={[]}
      onCancel={finished}>
      <div className={cls['report-content-box']}>
        <div className={cls['report-tool-box']}>
          <ToolBar current={current} handClick={handClick} setModal={setModal}></ToolBar>
        </div>
        <HotTableView current={current} selectItem={selectItem} reportChange={reportChange} changeType={changeType}></HotTableView>
        {/* <HotTable
          ref={hotRef}
          rowHeaders={true}
          colHeaders={true}
          stretchH="all"
          formulas={{
            engine: hyperformulaInstance,
          }}
          mergeCells={mergeData}
          height="auto"
          dropdownMenu={true}
          manualColumnResize={true}
          manualRowResize={true}
          autoColumnSize={autoColumn}
          autoRowSize={autoRow}
          multiColumnSorting={true}
          contextMenu={true}
          filters={true}
          copyable={true}
          language={zhCN.languageCode}
          outsideClickDeselects={false}
          cell={[
            { row: 1, col: 0, type:'date' }
          ]}
          selectionMode="multiple"
          licenseKey="non-commercial-and-evaluation"
          afterChange={function(change, source) {
            console.log(change,source,'123')
            let arr:any =[]
            if(change && change.length>0){
              change.forEach(item=>{
                let json1={row:item[0],col:item[1],val:item[3]}
                arr.push(json1)
              })
            }
            rulesData = arr
          }}
          afterMergeCells={function(change, source){
            console.log(change,source)
            mergeData.push(source)
          }}
          afterUpdateSettings={function(change){
            console.log(change)
          }}
          afterSetCellMeta={function(row, col, key, val) {
            if(key != 'hidden' && key != 'spanned'){
              let json = {row:row,col:col,key:key,val:val}
              cellMeta.push(json)
            }
          }}
          afterFormulasValuesUpdate={afterFormulasValuesUpdate}
        /> */}
      </div>
    </FullScreenModal>
	);
};
export default ReportView;