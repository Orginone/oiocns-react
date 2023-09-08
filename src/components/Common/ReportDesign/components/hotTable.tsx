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
  const [rowHeights, setRowHeights] = useState<any>([]);
  const [colWidths, setColWidths] = useState<any>([]);
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
  let mergeCells = selectItem?.data?.setting?.mergeCells || [];

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    setCells(selectItem?.data?.setting?.cells || []);
    setStyleList(selectItem?.data?.setting?.styleList || []);
    setClassList(selectItem?.data?.setting?.classList || []);
    setRowHeights(selectItem?.data?.setting?.row_h || []);
    setColWidths(selectItem?.data?.setting?.col_w || []);
    hot.updateSettings({
      data: selectItem?.data?.data,
      cell: cells,
      mergeCells: mergeCells,
    });
  }, [selectItem]);

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
          } else if (changeType !== 'border') {
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
    let setRowHeightInstance = hotRef.current.hotInstance.getPlugin('ManualRowResize');
    console.log(setRowHeightInstance, '12345')
    let count_col = hotRef.current.hotInstance.countCols();//获取列数
    let count_row = hotRef.current.hotInstance.countRows();//获取行数
    let row_h: any = [];
    let col_w: any = [];
    for (var i = 0; i < count_col; i++){
      col_w.push(hotRef.current.hotInstance.getColWidth(i))
    }
    for (var i = 0; i < count_row; i++){
      row_h.push(hotRef.current.hotInstance.getRowHeight(i))
    }       
    let newData = hotRef.current.hotInstance.getData();
    let json = {
      data: newData,
      setting: {
        mergeCells:
          hotRef.current.hotInstance.getPlugin('mergeCells').mergedCellsCollection
            .mergedCells,
        cells: cells,
        styleList: styleList,
        classList: classList,
        row_h: row_h,
        col_w: col_w
        // columns:columns,
        // cellMeta:cellMeta,
        // columnSummary:columnSummary,
        // cellList:cellData
      },
    };
    selectItem.data = json;
    await current.update({
      id: current.id,
      name: current.name,
      code: current.code,
      rule: JSON.stringify(selectItem),
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
          hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer =
            'customStylesRenderer';
        }
      }
    }
  };

  const upDataCell = () => {
    // 更新特性rules 但单元格只有只读属性 readOnly
    cells.forEach((item: any) => {
      current.attributes.forEach((items: any) => {
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

  const afterOnCellMouseDown = (event: any, coords: any, TD: any) => {
    // console.log(event, coords, TD)
    cells?.forEach((item: any) => {
      if (item.row === coords.row && item.col === coords.col) {
        setModalType('配置特性');
        setSelectedItem(item.prop);
      }
    });
  };

  registerRenderer('customStylesRenderer', (hotInstance: any, TD: any, ...rest) => { //渲染特性背景色
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#e1f3d8';
  });

  registerRenderer('cellStylesRenderer', (hotInstance: any, TD: any, ...rest) => { //渲染样式
    textRenderer(hotInstance, TD, ...rest);
    let items = styleList.find((it: any) => it.row === rest[0] && it.col === rest[1])
    let td: any = TD.style
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
        colWidths={colWidths}
        rowHeights={rowHeights}
        dropdownMenu={true}
        height="700px"
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
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
              callback: function () {
                setModalType('新增特性');
              },
            },
          },
        }}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterOnCellMouseDown={afterOnCellMouseDown} //鼠标点击单元格边角后被调用
      />

      {modalType.includes('新增特性') && (
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
            selected={current.attributes.map((a: any) => a.property!)}
            onAdded={async (prop: any) => {
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
              const attr = current.attributes.find((i: any) => i.propId === prop.id);
              if (attr) {
                saveSpeciality(attr);
              }
            }}
            onDeleted={async (id: any) => {
              const attr = current.attributes.find((i: any) => i.propId === id);
              if (attr) {
                await current.deleteAttribute(attr);
                tforceUpdate();
              }
            }}
          />
        </Modal>
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
