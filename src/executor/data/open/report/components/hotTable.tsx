import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from "@handsontable/react";
import { Modal } from 'antd';
import { HyperFormula } from 'hyperformula';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import "handsontable/dist/handsontable.min.css";
import SelectPropertys from '@/executor/config/operateModal/labelsModal/Attritube/SelectPropertys';
import AttributeConfig from '@/components/Common/FormDesign/attributeConfig';
import { AttributeModel } from '@/ts/base/model';
import { IReport } from '@/ts/core';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XAttribute } from '@/ts/base/schema';
import { model } from '@/ts/base';
interface IProps {
  current: IReport,
  selectItem:any,
  reportChange:any,
  changeType:string,
}
let mergeData:any = []

const HotTableView: React.FC<IProps> = ({ current, selectItem, reportChange, changeType }) => {
  const [modalType, setModalType] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [selectedItem,setSelectedItem] = useState<XAttribute>();
  const [cells, setCells] = useState<any>([]);
  // 项配置改变
  const formValuesChange = (changedValues: any) => {
    if (selectedItem) {
      selectedItem.rule = selectedItem.rule || '{}';
      const rule = { ...JSON.parse(selectedItem.rule), ...changedValues };
      setSelectedItem({
        ...selectedItem,
        rule: JSON.stringify(rule),
      });
      current.updateAttribute({ ...selectedItem, ...rule, rule: JSON.stringify(rule) });
    }
  };
  const hotRef:any = useRef(null)
  let sheetList = current.metadata?.rule?JSON.parse(current.metadata?.rule):[]
  let sheetIndex = sheetList.findIndex((it:any)=>it.code === selectItem.code)
  let datas = sheetList[sheetIndex]?.data?.data || [[]]
  let setting = sheetList[sheetIndex]?.data?.setting || {}
  cells?.forEach((item:any)=>{ //渲染单元格颜色
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer = 'customStylesRenderer';
  })
  
  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    setCells(setting?.cells || [])
    hot.updateSettings({
      data: datas,
      cell: cells,
    });
    // changeSize = () =>{
    //   autoColumn = !autoColumn
    // };
    // selectOptionChangeCallback = event =>{
    //   console.log(event,'event')
    //   const selected = hot.getSelected() || [];
    //   console.log(selected,'selected')
    // } 
  },[])

  const buttonClickCallback = () => { // 工具栏按钮点击
    const selected = hotRef.current.hotInstance.getSelected() || [];
    hotRef.current.hotInstance.suspendRender();
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
          if(changeType == 'dataType'){
            // let json = { row: rowIndex, col: columnIndex, type:reportChange}
            // cell.push(json)
            // reportChange=''
            // // hot.setCellMeta(rowIndex, columnIndex, 'type', reportChange);
            // hot.updateSettings({
            //   cell: cell,
            // });
          }else if(changeType == 'mergeAndCenter'){

          }else{
            hotRef.current.hotInstance.setCellMeta(rowIndex, columnIndex, 'className', reportChange);
          }
        }
      }
    }
    hotRef.current.hotInstance.render();
    hotRef.current.hotInstance.resumeRender();
  }

  if(changeType !== ''){
    buttonClickCallback()
  }

  const saveClickCallback = async() => { // 保存
    let newData = hotRef.current.hotInstance.getData()
    let json = {
      data:newData,
      setting:{
        mergeCells:hotRef.current.hotInstance.getPlugin('mergeCells').mergedCellsCollection.mergedCells,
        autoColumnSize:hotRef.current.hotInstance.getPlugin('autoColumnSize').enabled,
        AutoRowSize:hotRef.current.hotInstance.getPlugin('AutoRowSize').enabled,
        cells:cells
        // columns:columns,
        // cellMeta:cellMeta,
        // styleList:styleList,
        // columnSummary:columnSummary,
        // cellList:cellData
      }
    }
    console.log(json,'保存数据结构---还未更新完')
    sheetList[sheetIndex].data = json
    await current.update(
      {
        id:current.id,
        name: current.name,
        code: current.code,
        rule: JSON.stringify(sheetList),
      } as model.FormModel,
    )
    // for(var i = 0;i<newData.length;i++){
    //   for(var k=0;k<rulesData.length;k++){
    //     if(i==rulesData[k].row){
    //       newData[i][rulesData[k].col] = rulesData[k].val
    //     }
    //   }
    // }
    // var mergeCellArr = hot.Plugins('Mergecells')
    // console.log(mergeCellArr,'mergeCellArr')
  }

  if(changeType == 'onSave'){
    saveClickCallback()
  }
  
  let autoColumn:boolean = true
  let autoRow:boolean = false

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const saveSpeciality = (prop:XAttribute) => {
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          let json = { row: rowIndex, col: columnIndex, type:'', prop:prop}
          console.log(cells,'cells')
          if(prop.property?.valueType === '数值型'){
            json.type = 'numeric'
            cells.push(json)
          }else if(prop.property?.valueType === '时间型'){
            json.type = 'date'
            cells.push(json)
          }else{
            json.type = 'text'
            cells.push(json)
          }
          // hotRef.current.hotInstance.updateSettings({
          //   cell: cell,
          // });
          hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer = 'customStylesRenderer';
          // hotRef.current.hotInstance.setDataAtCell(rowIndex, columnIndex, prop.name);
        }
      }
    }
  }

  const upDataCell = () =>{ // 更新特性rules 但单元格只有只读属性 readOnly
    cells.forEach((item:any)=>{
      current.attributes.forEach(items=>{
        if(item.prop.propId === items.propId){
          item.prop = items
          let newRule = JSON.parse(item.prop.rule)
          if(newRule){
            for(var key in newRule){
              hotRef.current.hotInstance.setCellMeta(item.row,item.col,key,newRule[key])
            }
          }
        }
      })
    })
  }

  const afterFormulasValuesUpdate = (changes:any) => { //公式更新后
    changes.forEach((change:any) => {
      // console.log('change', change.address, change.newValue);
    });
  };

  const afterOnCellMouseDown = (event:any,coords:any, TD:any) => {
    // console.log(event,coords,TD)
    // console.log(cells,'cell2')
    cells?.forEach((item:any)=>{
      if(item.row === coords.row && item.col === coords.col){
        setModalType('配置特性');
        setSelectedItem(item.prop)
      }
    })
  }

  const afterChange = (change:any,source:any) =>{ // 修改后
    // console.log(change,source,'123aa')
    let arr:any =[]
    if(change && change.length>0){
      change.forEach((item:any)=>{
        let json1={row:item[0],col:item[1],val:item[3]}
        arr.push(json1)
      })
    }
    // rulesData = arr
  }

  const afterSetCellMeta = (row:Number, col:Number, key:string, val:boolean) =>{
    console.log(row, col, key, val,'row, col, key, val')
    if(key != 'hidden' && key != 'spanned'){
      // let json = {row:row,col:col,key:key,val:val}
      // cellMeta.push(json)
    }
  }

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#e1f3d8'
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
        // cell={cell}
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
          // console.log(row, column, row2, column2, preventScrolling, selectionLayerLevel)
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
          // console.log(change)
        }}
        afterSetCellMeta={afterSetCellMeta}
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
              const attr = current.attributes.find((i) => i.propId === prop.id);
              if(attr){
                saveSpeciality(attr)
              }
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

      {/** 编辑特性模态框 */}
      {modalType.includes('配置特性') && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setSelectedItem(undefined);
            setModalType('');
            tforceUpdate();
            console.log(current,'12345')
            upDataCell()
          }}
          superAuth={current.directory.target.space.superAuth!.metadata}
        />
      )}
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