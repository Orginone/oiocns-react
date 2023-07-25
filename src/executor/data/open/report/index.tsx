import React, {useState} from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import HotTableView from './components/hotTable';
import ToolBar from './components/tool';
import cls from './index.module.less';
import { IReport } from '@/ts/core';

interface IProps {
  current: IReport;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, finished }) => {
  const [reportChange,setReportChange] = useState<any>();
  const [changeType,setChangeType] = useState<string>('');
  const handClick = (value:any,type:string) =>{
    setReportChange(value)
    setChangeType(type)
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
          <ToolBar current={current} handClick={handClick}></ToolBar>
        </div>
        <HotTableView current={current} reportChange={reportChange} changeType={changeType}></HotTableView>
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

      {/* <div className="controls">
        <button id="load" className="button button--primary button--blue" onClick={(...args) => loadClickCallback(...args)}>加载数据</button>&nbsp;
        <button id="save" className="button button--primary button--blue" onClick={(...args) => saveClickCallback(...args)}>保存数据</button>
        <button className="button button--primary button--blue" onClick={(...args) => changeSize(...args)}>列宽自适应</button>
        <button className="button button--primary button--blue" onClick={(...args) => buttonClickCallback(...args)}>修改样式</button>
        <button className="button button--primary button--blue" onClick={(...args) => selectOptionChangeCallback(...args)}>获取选择</button>
      </div> */}
    </FullScreenModal>
	);
};
export default ReportView;