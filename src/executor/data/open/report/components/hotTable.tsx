import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from "@handsontable/react";
import { Modal } from 'antd';
import { HyperFormula } from 'hyperformula';
// import { data,columns,columnSummary } from "./constants";
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import "handsontable/dist/handsontable.min.css";
import SelectPropertys from '@/executor/config/operateModal/labelsModal/Attritube/SelectPropertys';
import { AttributeModel } from '@/ts/base/model';
import { IReport } from '@/ts/core';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XProperty } from '@/ts/base/schema';

interface IProps {
  current: IReport,
  reportChange:any,
  changeType:string,
}

const HotTableView: React.FC<IProps> = ({ current, reportChange, changeType }) => {
  const [modalType, setModalType] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const hotRef:any = useRef(null)
  
  useEffect(() => {
    const hot = hotRef.current.hotInstance;

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
            // const kv = hot.getCellMeta(rowIndex, columnIndex)
            // console.log(kv,'kv')

            // const cell = hot.getCell(rowIndex, columnIndex);
            // cell.style[changeType] = reportChange;

            // kv[changeType] = reportChange;
            // hot.setCellMeta(rowIndex, columnIndex, 'style', kv);
            // hot.setDataAtCell(rowIndex, columnIndex, 'data changed');
            // hot.getCellMeta(rowIndex, columnIndex).renderer = 'customStylesRenderer';
            hot.setCellMeta(rowIndex, columnIndex, 'className', reportChange);
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

  const saveSpeciality = (prop:XProperty) => {
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          hotRef.current.hotInstance.setDataAtCell(rowIndex, columnIndex, prop.name);
        }
      }
    }
  }

  const afterFormulasValuesUpdate = (changes:any) => {
    changes.forEach((change:any) => {
      console.log('change', change.address, change.newValue);
    });
  };

  const afterOnCellMouseDown = (event:any,coords:any, TD:any) => {
    console.log(event,coords,TD)
  }

  const afterChange = (change:any,source:any) =>{
    console.log(change,source,'123')
    let arr:any =[]
    if(change && change.length>0){
      change.forEach((item:any)=>{
        let json1={row:item[0],col:item[1],val:item[3]}
        arr.push(json1)
      })
    }
    rulesData = arr
  }
  
  const mergeData:any = []

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    // if(changeType === 'typeFace'){
    //   TD.style.fontFamily = reportChange
    // }
    // if(changeType === 'fontSize'){
    //   TD.style.fontSize = reportChange + 'px'
    // }
    // if(changeType === 'setFontWeight'){
    //   TD.style.fontWeight = reportChange
    // }
    // if(changeType === 'setFontStyle'){
    //   TD.style.fontStyle = reportChange
    // }
    // if(changeType === 'backgroundColor'){
    //   TD.style.background = reportChange
    // }
    // if(changeType === 'color'){
    //   TD.style.color = reportChange
    // }
    // if(changeType === 'setPaddingLeft'){
    //   TD.style.paddingLeft = reportChange
    // }
    // TD.style.fontWeight = 'bold';
    // TD.style.color = 'green';
    // TD.style.background = '#d7f1e1';
    // let json = {row:rest[0],col:rest[1],color:'green',background:'#d7f1e1',fontWeight:'bold'}
    // styleList.push(json)
  });

	return (
    <div>
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
        // contextMenu={true}
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        autoColumnSize={autoColumn}
        autoRowSize={autoRow}
        multiColumnSorting={true}
        // cell={[
        //   { row: 1, col: 0, type:'date' }
        // ]}
        contextMenu={{
          items: {
            'row_above': {},
            'row_below': {},
            'col_left':{},
            'col_right':{},
            'make_read_only':{},
            'alignment':{},
            'mergeCells':{},
            // 'separator': ContextMenu.SEPARATOR,
            // 'clear_custom': {
            //   name: 'Clear all cells (custom)',
            //   callback: function() {
            //     this.clear();
            //   }
            // }
            'insert_speciality': {
              name: '插入特性',
              callback: function(key, options) {
                console.log(key,options,'1234')
                setModalType('新增特性');
              }
            }
          }
        }}
        afterSelection={(row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
          console.log(row, column, row2, column2, preventScrolling, selectionLayerLevel)
          // preventScrolling.value = true;
        }}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterChange={afterChange}
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

      {
        modalType=='新增特性'?
        <Modal
          open
          width={800}
          title="选择属性"
          destroyOnClose
          okText="确定"
          onOk={() => {setModalType('')}}
          onCancel={() => setModalType('')}>
          <SelectPropertys
            target={current.directory.target}
            selected={current.attributes.map((a) => a.property!)}
            onAdded={async (prop) => {
              saveSpeciality(prop)
              await current.createAttribute(
                {
                  name: prop.name,
                  code: prop.code,
                  rule: '{}',
                  remark: prop.remark,
                } as AttributeModel,
                prop,
              );
              tforceUpdate();
            }}
            onDeleted={async (id) => {
              const attr = current.attributes.find((i) => i.propId === id);
              if (attr) {
                await current.deleteAttribute(attr);
                tforceUpdate();
              }
            }}
          />
        </Modal>:''
      }
    </div>
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