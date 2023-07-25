import React, { useEffect, useRef } from 'react';
import { HotTable } from "@handsontable/react";
import { HyperFormula } from 'hyperformula';
// import { data,columns,columnSummary } from "./constants";
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import "handsontable/dist/handsontable.min.css";
import { IReport } from '@/ts/core';

interface IProps {
  current: IReport,
  reportChange:any,
  changeType:string
}

const HotTableView: React.FC<IProps> = ({ current, reportChange, changeType }) => {
  const hotRef:any = useRef(null)
  
  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    console.log(hot,'hot')

    const buttonClickCallback = () => {
      const selected = hot.getSelected() || [];
      // console.log(selected,'selected')
      hot.suspendRender();
      for (let index = 0; index < selected.length; index += 1) {
        const [row1, column1, row2, column2] = selected[index];
        const startRow = Math.max(Math.min(row1, row2), 0);
        const endRow = Math.max(row1, row2);
        const startCol = Math.max(Math.min(column1, column2), 0);
        const endCol = Math.max(column1, column2);
  
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
          for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
            // hot.setDataAtCell(rowIndex, columnIndex, 'data changed');
            hot.getCellMeta(rowIndex, columnIndex).renderer = 'customStylesRenderer';
            // hot.setCellMeta(rowIndex, columnIndex, 'className', 'c-red');
          }
        }
      }
      hot.render();
      hot.resumeRender();
    }

    if(changeType !== ''){
      buttonClickCallback()
    }
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
    // selectOptionChangeCallback = event =>{
    //   console.log(event,'event')
    //   const selected = hot.getSelected() || [];
    //   console.log(selected,'selected')
    // } 
  })
  
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

  const afterOnCellMouseDown = (event:any,coords:any, TD:any) => {
    console.log(event,coords,TD)
  }
  const mergeData:any = []

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    if(changeType === 'typeFace'){
      TD.style.fontFamily = reportChange
    }else if(changeType === 'fontSize'){
      TD.style.fontSize = reportChange + 'px'
    }else if(changeType === 'setFontWeight'){
      TD.style.fontWeight = reportChange
    }else if(changeType === 'setFontStyle'){
      TD.style.fontStyle = reportChange
    }
    // TD.style.fontWeight = 'bold';
    // TD.style.color = 'green';
    // TD.style.background = '#d7f1e1';
    // let json = {row:rest[0],col:rest[1],color:'green',background:'#d7f1e1',fontWeight:'bold'}
    // styleList.push(json)
  });

	return (
    <HotTable
      ref={hotRef}
      formulas={{
        engine: hyperformulaInstance,
      }}
      minCols={10}
      minRows={20}
      rowHeaders={true}
      colHeaders={true}
      dropdownMenu={true}
      // manualColumnMove={true} // 列移动
      // manualRowMove={true} // 行移动
      height="auto"
      mergeCells={mergeData}
      contextMenu={true}
      language={zhCN.languageCode}
      stretchH="all"
      manualColumnResize={true}
      manualRowResize={true}
      autoColumnSize={autoColumn}
      autoRowSize={autoRow}
      multiColumnSorting={true}
      cell={[
        { row: 1, col: 0, type:'date' }
      ]}
      afterSelection={(row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
        console.log(row, column, row2, column2, preventScrolling, selectionLayerLevel)
        // preventScrolling.value = true;
      }}
      outsideClickDeselects={false}
      licenseKey="non-commercial-and-evaluation" // for non-commercial use only
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
      afterOnCellMouseDown={afterOnCellMouseDown} //鼠标点击单元格边角后被调用
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
    // {/* <div className="controls">
    //   <button id="load" className="button button--primary button--blue" onClick={(...args) => loadClickCallback(...args)}>加载数据</button>&nbsp;
    //   <button id="save" className="button button--primary button--blue" onClick={(...args) => saveClickCallback(...args)}>保存数据</button>
    //   <button className="button button--primary button--blue" onClick={(...args) => changeSize(...args)}>列宽自适应</button>
    //   <button className="button button--primary button--blue" onClick={(...args) => buttonClickCallback(...args)}>修改样式</button>
    //   <button className="button button--primary button--blue" onClick={(...args) => selectOptionChangeCallback(...args)}>获取选择</button>
    // </div> */}
	)
};
export default HotTableView;