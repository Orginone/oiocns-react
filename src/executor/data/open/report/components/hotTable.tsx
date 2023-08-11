import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { Modal } from 'antd';
import { HyperFormula } from 'hyperformula';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import 'handsontable/dist/handsontable.min.css';
import SelectPropertys from '@/executor/config/operateModal/labelsModal/Attritube/SelectPropertys';
import AttributeConfig from '@/components/Common/FormDesign/attributeConfig';
import { AttributeModel } from '@/ts/base/model';
import { IReport } from '@/ts/core';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { XAttribute } from '@/ts/base/schema';
import { model } from '@/ts/base';
interface IProps {
  current: IReport;
  selectItem: any;
  reportChange: any;
  changeType: string;
  classType: string;
}

const HotTableView: React.FC<IProps> = ({
  current,
  selectItem,
  reportChange,
  changeType,
  classType
}) => {
  const [modalType, setModalType] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [selectedItem, setSelectedItem] = useState<XAttribute>();
  const [cells, setCells] = useState<any>([]);
  const [styleList, setStyleList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
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
  const hotRef: any = useRef(null);
  let sheetList = current.metadata?.rule ? JSON.parse(current.metadata?.rule) : [];
  let sheetIndex = sheetList.findIndex((it: any) => it.code === selectItem.code);
  let datas = sheetList[sheetIndex]?.data?.data || [[]];
  let setting = sheetList[sheetIndex]?.data?.setting || {};
  let mergeCells = setting?.mergeCells || [];
  let autoColumn: boolean = true; //自适应
  let autoRow: boolean = false;

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    
    setCells(setting?.cells || []);
    setStyleList(setting?.styleList || []);
    setClassList(setting?.classList || []);
    hot.updateSettings({
      data: datas,
      cell: cells,
      mergeCells: mergeCells,
    });
  }, []);

  styleList?.forEach((item: any) => {
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
          'cellStylesRenderer';
  })

  classList?.forEach((item: any) => {
    let arr = []
    for (let k in item.class) {
      arr.push(item.class[k])
    }
    hotRef.current.hotInstance.setCellMeta(item.row, item.col, 'className', arr.join(' '));
  })

  cells?.forEach((item: any) => {
    //渲染单元格颜色
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
      'customStylesRenderer';
  });

  const buttonClickCallback = () => {
    // 工具栏按钮点击
    const selected = hotRef.current.hotInstance.getSelected() || [];
    hotRef.current.hotInstance.suspendRender();
    if (changeType === 'border') {
      const customBordersPlugin = hotRef.current.hotInstance.getPlugin('customBorders');
      if (classType !== 'none') {
        customBordersPlugin.setBorders(hotRef.current.hotInstance.getSelectedRange(), { [classType]: { hide: false, width: 1, color: '#000000' } });
      } else {
        customBordersPlugin.clearBorders(hotRef.current.hotInstance.getSelectedRange());
      }
    }
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          if (changeType === 'className') {
            if (classList.length > 0) {
              let items = classList.find((it: any) => it.col === columnIndex && it.row === rowIndex)
              if (items) {
                for (let k in items.class) {
                  if (k === classType) {
                    items.class[k] = reportChange
                  } else {
                    items.class[classType] = reportChange
                  }
                }
              } else {
                let json: any = { col: columnIndex, row: rowIndex, class: {} }
                json.class[classType] = reportChange
                classList.push(json)
              }
            } else {
              let json: any = { col: columnIndex, row: rowIndex, class: {} }
              json.class[changeType] = reportChange
              classList.push(json)
            }
            let items = classList.find((it: any) => it.row === rowIndex && it.col === columnIndex)
            let arr = []
            if (items) {
              for (let k in items.class) {
                arr.push(items.class[k])
              }
            }
            hotRef.current.hotInstance.setCellMeta(rowIndex, columnIndex, 'className', arr.join(' '));
          } else if(changeType !== 'border') {
            if (styleList.length > 0) {
              let items = styleList.find((it: any) => it.col === columnIndex && it.row === rowIndex)
              if (items) {
                for (let k in items.styles) {
                  if (k === changeType) {
                    items.styles[k] = reportChange
                  } else {
                    items.styles[changeType] = reportChange
                  }
                }
              } else {
                let json: any = { col: columnIndex, row: rowIndex, styles: {} }
                json.styles[changeType] = reportChange
                styleList.push(json)
              }
            } else {
              let json: any = { col: columnIndex, row: rowIndex, styles: {} }
              json.styles[changeType] = reportChange
              styleList.push(json)
            }
            hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer =
              'cellStylesRenderer';
          }
        }
      }
    }
    hotRef.current.hotInstance.render();
    hotRef.current.hotInstance.resumeRender();
  };

  if (changeType !== '' && changeType !== 'onSave') {
    buttonClickCallback();
  }

  const saveClickCallback = async () => {
    // 保存 保存数据结构---还未更新完
    let newData = hotRef.current.hotInstance.getData();
    let json = {
      data: newData,
      setting: {
        mergeCells:
          hotRef.current.hotInstance.getPlugin('mergeCells').mergedCellsCollection
            .mergedCells,
        autoColumnSize: hotRef.current.hotInstance.getPlugin('autoColumnSize').enabled,
        AutoRowSize: hotRef.current.hotInstance.getPlugin('AutoRowSize').enabled,
        cells: cells,
        styleList: styleList,
        classList: classList,
        // columns:columns,
        // cellMeta:cellMeta,
        // columnSummary:columnSummary,
        // cellList:cellData
      },
    };
    sheetList[sheetIndex].data = json;
    await current.update({
      id: current.id,
      name: current.name,
      code: current.code,
      rule: JSON.stringify(sheetList),
    } as model.FormModel);
  };

  if (changeType == 'onSave') {
    saveClickCallback();
  }

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const saveSpeciality = (prop: XAttribute) => {
    //插入特性
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          let json = { row: rowIndex, col: columnIndex, type: '', prop: prop };
          if (prop.property?.valueType === '数值型') {
            json.type = 'numeric';
            cells.push(json);
          } else if (prop.property?.valueType === '时间型') {
            json.type = 'date';
            cells.push(json);
          } else {
            json.type = 'text';
            cells.push(json);
          }
          // hotRef.current.hotInstance.updateSettings({
          //   cell: cell,
          // });
          hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer =
            'customStylesRenderer';
          // hotRef.current.hotInstance.setDataAtCell(rowIndex, columnIndex, prop.name);
        }
      }
    }
  };

  const upDataCell = () => {
    // 更新特性rules 但单元格只有只读属性 readOnly
    cells.forEach((item: any) => {
      current.attributes.forEach((items) => {
        if (item.prop.propId === items.propId) {
          item.prop = items;
          let newRule = JSON.parse(item.prop.rule);
          if (newRule) {
            for (var key in newRule) {
              hotRef.current.hotInstance.setCellMeta(
                item.row,
                item.col,
                key,
                newRule[key],
              );
            }
          }
        }
      });
    });
  };

  const afterFormulasValuesUpdate = (changes: any) => {
    //公式更新后
    changes.forEach((change: any) => {
      // console.log('change', change);
    });
  };

  const afterOnCellMouseDown = (event: any, coords: any, TD: any) => {
    // console.log(event, coords, TD)
    cells?.forEach((item: any) => {
      if (item.row === coords.row && item.col === coords.col) {
        setModalType('配置特性');
        setSelectedItem(item.prop);
      }
    });
  };

  const afterChange = (change: any, source: any) => {
    // 修改后
    // console.log(change, source)
    let arr: any = [];
    if (change && change.length > 0) {
      change.forEach((item: any) => {
        let json1 = { row: item[0], col: item[1], val: item[3] };
        arr.push(json1);
      });
    }
    // rulesData = arr
  };

  const afterSetCellMeta = (row: Number, col: Number, key: string, val: boolean) => {
    // console.log(row, col, key, val, 'row, col, key, val')
    if (key != 'hidden' && key != 'spanned') {
      // let json = {row:row,col:col,key:key,val:val}
      // cellMeta.push(json)
    }
  };

  const afterBeginEditing = (row: Number, col: Number) => {
    //修改后
    console.log(row, col, 'row,col')
    // const editobj = hotRef.current.hotInstance.getActiveEditor(); //当前编辑的对象
    // const nowcell = editobj.TD; //当前编辑的格子
    // console.log(editobj, nowcell)
    // editobj.textareaStyle.color = nowcell.style.color;//获取当前编辑格子的颜色
    // nowcell.innerHTML = ""; //这个主要是解决上面颜色透明的问题
  };

  const afterUpdateSettings = (change: any) => {
    console.log(change, 'change');
  };

  const afterSelection = (
    row: Number,
    column: Number,
    row2: Number,
    column2: Number,
    preventScrolling: any,
    selectionLayerLevel: any,
  ) => {};

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => { //渲染特性背景色
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#e1f3d8';
  });

  registerRenderer('cellStylesRenderer', (hotInstance, TD, ...rest) => { //渲染样式
    textRenderer(hotInstance, TD, ...rest);
    let items = styleList.find((it: any) => it.row === rest[0] && it.col === rest[1])
    let td:any = TD.style
    if (items) {
      for (let key in items.styles) {
        td[key] = items.styles[key];
      }
    }
  });


  return (
    <div>
      <HotTable
        ref={hotRef}
        formulas={{
          engine: hyperformulaInstance,
        }}
        minCols={8}
        minRows={60}
        rowHeaders={true}
        colHeaders={true}
        dropdownMenu={true}
        // manualColumnMove={true} // 列移动
        // manualRowMove={true} // 行移动
        height="auto"
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        autoColumnSize={autoColumn}
        autoRowSize={autoRow}
        multiColumnSorting={true}
        contextMenu={{
          items: {
            row_above: {},
            row_below: {},
            col_left: {},
            col_right: {},
            make_read_only: {},
            alignment: {},
            mergeCells: {},
            insert_speciality: {
              name: '插入特性',
              callback: function (key, options) {
                setModalType('新增特性');
              },
            },
          },
        }}
        afterSelection={afterSelection}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterChange={afterChange}
        afterOnCellMouseDown={afterOnCellMouseDown} //鼠标点击单元格边角后被调用
        afterUpdateSettings={afterUpdateSettings}
        afterBeginEditing={afterBeginEditing}
        afterSetCellMeta={afterSetCellMeta}
        afterFormulasValuesUpdate={afterFormulasValuesUpdate}
      />

      {modalType == '新增特性' ? (
        <Modal
          open
          width={800}
          title="选择属性"
          destroyOnClose
          okText="确定"
          onOk={() => {
            setModalType('');
          }}
          onCancel={() => setModalType('')}
        >
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
              if (attr) {
                saveSpeciality(attr);
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
        </Modal>
      ) : (
        ''
      )}

      {/** 编辑特性模态框 */}
      {modalType.includes('配置特性') && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setSelectedItem(undefined);
            setModalType('');
            tforceUpdate();
            upDataCell();
          }}
          superAuth={current.directory.target.space.superAuth!.metadata}
        />
      )}
    </div>
  );
};
export default HotTableView;
