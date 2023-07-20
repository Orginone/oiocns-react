import React, { useEffect, useRef } from 'react';
import FullScreenModal from '../../../../executor/tools/fullScreen';
import { HotTable } from "@handsontable/react";
import { HyperFormula } from 'hyperformula';
import { data,columns,columnSummary } from "./constants";
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import "handsontable/dist/handsontable.min.css";
import { IReport } from '../../../../ts/core';
import ToolBar from './components/tool';
import cls from './index.module.less';

interface IProps {
  current: IReport;
  finished: () => void;
}

const ReportView: React.FC<IProps> = ({ current, finished }) => {
  const hotRef:any = useRef(null);
  let cellMeta:any = []
  let styleList:any = []
  let rulesData:any = []
  let cellData:any = []
  let autoColumn:boolean = true
  let autoRow:boolean = false

  // let loadClickCallback:Function;
  // let saveClickCallback:Function;
  // let changeSize:Function;
  // let buttonClickCallback:Function;
  // let selectOptionChangeCallback:Function;

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const afterFormulasValuesUpdate = (changes:any) => {
    changes.forEach((change:any) => {
      console.log('change', change.address, change.newValue);
    });
  };
  const mergeData:any = []

  // const Settings:any = {
  //   rowHeaders:true,
  //   colHeaders:true,
  //   stretchH:"all",
  //   formulas:{
  //     engine: hyperformulaInstance,
  //   },
  //   mergeCells:{mergeData},
  //   height:"auto",
  //   dropdownMenu:true,
  //   manualColumnResize:true,
  //   manualRowResize:true,
  //   autoColumnSize:autoColumn,
  //   autoRowSize:autoRow,
  //   multiColumnSorting:true,
  //   contextMenu:true,
  //   filters:true,
  //   language:zhCN.languageCode,
  //   outsideClickDeselects:false,
  //   columnSummary:{columnSummary},
  //   cell:[
  //     { row: 1, col: 0, type:'date' }
  //   ],
  //   selectionMode:'multiple',
  //   licenseKey:"non-commercial-and-evaluation",
  //   afterChange:{function(change:any, source:any) {
  //     console.log(change,source,'123')
  //     let arr:any =[]
  //     if(change && change.length>0){
  //       change.forEach((item:any)=>{
  //         let json1={row:item[0],col:item[1],val:item[3]}
  //         arr.push(json1)
  //       })
  //     }
  //     rulesData = arr
  //   }},
  //   afterMergeCells:{function(change:any, source:any){
  //     console.log(change,source)
  //     mergeData.push(source)
  //   }},
  //   afterUpdateSettings:{function(change:any){
  //     console.log(change)
  //   }},
  //   afterSetCellMeta:{function(row:any, col:any, key:any, val:any) {
  //     if(key != 'hidden' && key != 'spanned'){
  //       let json = {row:row,col:col,key:key,val:val}
  //       cellMeta.push(json)
  //     }
  //   }},
  //   afterFormulasValuesUpdate:{afterFormulasValuesUpdate}
  // }

  const change = (value:any) =>{
    console.log(value,'value')
  }

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    console.log(hot,'hot')
    // saveClickCallback = () => {
    //   let newData = hot.getData()
    //   for(var i = 0;i<newData.length;i++){
    //     for(var k=0;k<rulesData.length;k++){
    //       if(i==rulesData[k].row){
    //         newData[i][rulesData[k].col] = rulesData[k].val
    //       }
    //     }
    //   }
    //   let json = {
    //     data:newData,
    //     setting:{
    //       mergeCells:hot.getPlugin('mergeCells').mergedCellsCollection.mergedCells,
    //       autoColumnSize:hot.getPlugin('autoColumnSize').enabled,
    //       AutoRowSize:hot.getPlugin('AutoRowSize').enabled,
    //       columns:columns,
    //       cellMeta:cellMeta,
    //       styleList:styleList,
    //       columnSummary:columnSummary,
    //       cellList:cellData
    //     }
    //   }
    //   console.log(json)
    //   // var mergeCellArr = hot.Plugins('Mergecells')
    //   // console.log(mergeCellArr,'mergeCellArr')
    // };
    // changeSize = () =>{
    //   autoColumn = !autoColumn
    // };
    // buttonClickCallback = () => {
    //   const selected = hot.getSelected() || [];
    //   console.log(selected,'selected')
    //   hot.suspendRender();
    //   for (let index = 0; index < selected.length; index += 1) {
    //     const [row1, column1, row2, column2] = selected[index];
    //     const startRow = Math.max(Math.min(row1, row2), 0);
    //     const endRow = Math.max(row1, row2);
    //     const startCol = Math.max(Math.min(column1, column2), 0);
    //     const endCol = Math.max(column1, column2);

    //     for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
    //       for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
    //         hot.setDataAtCell(rowIndex, columnIndex, 'data changed');
    //         hot.getCellMeta(rowIndex, columnIndex).renderer = 'customStylesRenderer';
    //         // hot.setCellMeta(rowIndex, columnIndex, 'className', 'c-red');
    //       }
    //     }
    //   }
    //   hot.render();
    //   hot.resumeRender();
    // },
    // selectOptionChangeCallback = event =>{
    //   console.log(event,'event')
    //   const selected = hot.getSelected() || [];
    //   console.log(selected,'selected')
    // } 
  });

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    TD.style.fontWeight = 'bold';
    TD.style.color = 'green';
    TD.style.background = '#d7f1e1';
    let json = {row:rest[0],col:rest[1],color:'green',background:'#d7f1e1',fontWeight:'bold'}
    styleList.push(json)
  });

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
          <ToolBar current={current} reportChange={change}></ToolBar>
        </div>
        <HotTable
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
        />
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