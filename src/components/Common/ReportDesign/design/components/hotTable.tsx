import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import 'handsontable/dist/handsontable.min.css';
import { IForm, IProperty, orgAuth } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog';
import { Emitter } from '@/ts/base/common';
interface IProps {
  current: IForm;
  sheetList: any;
  sheetIndex: number;
  updataKey: string;
  reportChange: any;
  changeType: string;
  classType: any | undefined;
  notityEmitter: Emitter;
  handEcho: (cellStyle: any) => void;
  selectCellItem: (cell: any) => void;
}

const HotTableView: React.FC<IProps> = ({
  current,
  sheetList,
  sheetIndex,
  updataKey,
  reportChange,
  changeType,
  classType,
  notityEmitter,
  handEcho,
  selectCellItem,
}) => {
  const [modalType, setModalType] = useState<string>('');
  // const [sheetIndex, setSheetIndex] = useState<any>(0); // tabs页签
  const [cells, setCells] = useState<any>([]);
  const [styleList, setStyleList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
  const [customBorders, setCustomBorders] = useState<any>([]);
  const [copySelected, setCopySelected] = useState<any>();
  const [selectAttr, setSelectAttr] = useState<any>();
  const initRowCount: number = 60;
  const initColCount: number = 8;
  const defaultRowHeight: number = 23;
  const defaultColWidth: number = 50;
  const hotRef: any = useRef(null); // ref

  useEffect(() => {
    const sheetListData: any = current.metadata?.reportDatas
      ? JSON.parse(current.metadata?.reportDatas)
      : { 0: { name: 'sheet1', code: 'test1' } };
    const selectItem: any = Object.values(sheetListData)[sheetIndex];
    const setting = selectItem?.data?.setting || {};
    const datas = selectItem?.data?.data || [[]];
    updateHot(setting, datas);
    /** 特性监听 */
    const id = notityEmitter.subscribe((_, type, data) => {
      if (type === 'attr') {
        updateCells(data, setting?.cells);
      }
    });
    return () => {
      notityEmitter.unsubscribe(id);
    };
  }, [sheetIndex]);

  useEffect(() => {
    /** 根据工具栏类型进行操作 */
    switch (changeType) {
      case 'onSave':
        saveClickCallback();
        break;
      case 'copyStyle':
        copyStyle();
        return;
      case 'pasteStyle':
        pasteStyle();
        return;
      case 'border':
        setBorder(classType);
        return;
      case '':
        return;
      default:
        buttonClickCallback();
        return;
    }
  }, [updataKey]);

  const updateHot = (setting: any, data: any) => {
    const hot = hotRef.current.hotInstance;
    const customBordersPlugin = hot.getPlugin('customBorders');
    customBordersPlugin.clearBorders();
    const mergeCells = setting?.mergeCells || [];
    /** 初始化行高和列宽 */
    const row_h = [];
    for (let i = 0; i < initRowCount; i += 1) {
      row_h.push(defaultRowHeight);
    }
    const col_w = [];
    for (let j = 0; j < initColCount; j += 1) {
      col_w.push(defaultColWidth);
    }
    setCells(setting?.cells || []);
    setStyleList(setting?.styleList || []);
    setClassList(setting?.classList || []);
    setCustomBorders(setting?.customBorders || []);
    /** 更新报表 */
    hot.updateSettings({
      minCols: setting?.col_w ? setting?.col_w.length : initColCount,
      minRows: setting?.row_h ? setting?.row_h.length : initRowCount,
      data: data,
      mergeCells: mergeCells,
      rowHeights: setting?.row_h || row_h,
      colWidths: setting?.col_w || col_w,
    });
    /** 设置更新边框 */
    updateBorder(setting?.customBorders || []);
  };

  /** 复制样式 */
  const copyStyle = () => {
    const selected = hotRef.current.hotInstance.getSelected() || [];
    if (selected) {
      const items = styleList.find(
        (it: any) => it.col === selected[0][1] && it.row === selected[0][0],
      );
      setCopySelected(items);
    }
  };

  /** 粘贴样式 */
  const pasteStyle = () => {
    clearStyle();
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          /** 存储 */
          const item = styleList.find(
            (a: any) => a.col === columnIndex && a.row === rowIndex,
          );
          if (item) {
            item.styles = copySelected.styles;
          } else {
            let json: any = {
              col: columnIndex,
              row: rowIndex,
              styles: copySelected.styles,
            };
            styleList.push(json);
          }
          /** 渲染 */
          const kv =
            hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).style || {};
          if (copySelected) {
            Object.keys(copySelected?.styles).map((key) => {
              kv[key] = copySelected.styles[key];
            });
          }
          hotRef.current.hotInstance.setCellMeta(rowIndex, columnIndex, 'style', kv);
        }
      }
    }
  };

  // 清除格式
  const clearStyle = () => {
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          /** 清除存储 */
          const index = classList.findIndex(
            (a: any) => a.col === columnIndex && a.row === rowIndex,
          );
          if (index > -1) {
            classList.splice(index, 1);
          }
          /** 清除meta */
          let className =
            hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).className || '';
          className = className.replace(/htCenter|htLeft|htRight/, 'htLeft');
          className = className.replace(/htMiddle|htTop|htBottom/, 'htMiddle');
          hotRef.current.hotInstance.removeCellMeta(rowIndex, columnIndex, 'style');
          hotRef.current.hotInstance.setCellMeta(
            rowIndex,
            columnIndex,
            'className',
            className,
          );
        }
      }
    }
  };

  styleList?.forEach((item: any) => {
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
      'cellStylesRenderer';
  });

  classList?.forEach((item: any) => {
    let arr = [];
    for (let k in item.class) {
      arr.push(item.class[k]);
    }
    hotRef.current.hotInstance.setCellMeta(
      item.row,
      item.col,
      'className',
      arr.join(' '),
    );
  });

  /** 渲染单元格颜色 */
  cells?.forEach((item: any) => {
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
      'customStylesRenderer';
  });

  /** 设置边框 */
  const setBorder = (border: string, { width = 1, color = '#000000' } = {}) => {
    const customBordersPlugin = hotRef.current.hotInstance.getPlugin('customBorders');
    const { xMin, xMax, yMin, yMax } = getSelected();
    const range: any = [];
    let customBorder: any = {};
    switch (border) {
      case 'start':
        range.push([xMin, yMin, xMax, yMin]);
        customBorder.left = { hide: false, width, color };
        break;
      case 'end':
        range.push([xMin, yMax, xMax, yMax]);
        customBorder.right = { hide: false, width, color };
        break;
      case 'top':
        range.push([xMin, yMin, xMin, yMax]);
        customBorder.top = { hide: false, width, color };
        break;
      case 'bottom':
        range.push([xMax, yMin, xMax, yMax]);
        customBorder.bottom = { hide: false, width, color };
        break;
      case 'all':
        range.push([xMin, yMin, xMax, yMax]);
        customBorder.left = { hide: false, width, color };
        customBorder.right = { hide: false, width, color };
        customBorder.top = { hide: false, width, color };
        customBorder.bottom = { hide: false, width, color };
        break;
      case 'border-outline':
        setBorder('start', { width, color });
        setBorder('end', { width, color });
        setBorder('top', { width, color });
        setBorder('bottom', { width, color });
        return;
      case 'border-outline-2':
        setBorder('start', { width: 2, color });
        setBorder('end', { width: 2, color });
        setBorder('top', { width: 2, color });
        setBorder('bottom', { width: 2, color });
        return;
      case 'none':
        range.push([xMin, yMin, xMax, yMax]);
        customBorder.left = { hide: true, width: 0 };
        customBorder.right = { hide: true, width: 0 };
        customBorder.top = { hide: true, width: 0 };
        customBorder.bottom = { hide: true, width: 0 };
        customBordersPlugin.clearBorders(hotRef.current.hotInstance.getSelectedRange());
        break;
      default:
        break;
    }
    /** 存储边框数据 */
    let json = {
      range: range,
      border: border,
      customBorder: customBorder,
    };
    customBorders.push(json);
    if (range.length > 0 && customBorder) {
      customBordersPlugin.setBorders(range, customBorder);
    }
  };

  /** 更新边框 */
  const updateBorder = (customBordersProp: any) => {
    const customBordersPlugin = hotRef.current.hotInstance.getPlugin('customBorders');
    if (customBordersProp.length > 0) {
      customBordersProp.forEach((it: any) => {
        if (it.range.length > 0) {
          customBordersPlugin.setBorders(it.range, it.customBorder);
        }
      });
    }
  };

  /** 格式化所选, 返回从左上到右下的坐标，只返回最后一个 */
  const getSelected = () => {
    const selected = hotRef.current.hotInstance.getSelectedLast(); // [startRow, startCol, endRow, endCol]
    /** 没有选择区域，返回左上角，并标记 */
    if (!selected) {
      return {
        xMin: 0,
        yMin: 0,
        xMax: 0,
        yMax: 0,
        unselected: true,
      };
    }
    /** 因为会从不同的方向选择，需要重新排序 */
    const xMin = Math.min(selected[0], selected[2]);
    const xMax = Math.max(selected[0], selected[2]);
    const yMin = Math.min(selected[1], selected[3]);
    const yMax = Math.max(selected[1], selected[3]);
    return {
      xMin,
      xMax,
      yMin,
      yMax,
    };
  };

  /** 工具栏按钮点击 */
  const buttonClickCallback = () => {
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          if (changeType === 'className') {
            let json: any = { col: columnIndex, row: rowIndex, class: {} };
            if (classList.length > 0) {
              let items = classList.find(
                (it: any) => it.col === columnIndex && it.row === rowIndex,
              );
              if (items) {
                for (let k in items.class) {
                  if (k === classType) {
                    items.class[k] = reportChange;
                  } else {
                    items.class[classType] = reportChange;
                  }
                }
              } else {
                json.class[classType] = reportChange;
                classList.push(json);
              }
            } else {
              json.class[classType] = reportChange;
              classList.push(json);
            }
            let items = classList.find(
              (it: any) => it.row === rowIndex && it.col === columnIndex,
            );
            let arr = [];
            if (items) {
              for (let k in items.class) {
                arr.push(items.class[k]);
              }
            }
            hotRef.current.hotInstance.setCellMeta(
              rowIndex,
              columnIndex,
              'className',
              arr.join(' '),
            );
          } else {
            if (styleList.length > 0) {
              let index = styleList.findIndex(
                (it: any) => it.col === columnIndex && it.row === rowIndex,
              );
              if (index != -1) {
                for (let k in styleList[index]?.styles) {
                  if (k === changeType) {
                    styleList[index].styles[k] = reportChange;
                  } else {
                    styleList[index].styles[changeType] = reportChange;
                  }
                }
              } else {
                let json: any = { col: columnIndex, row: rowIndex, styles: {} };
                json.styles[changeType] = reportChange;
                styleList.push(json);
              }
            } else {
              let json: any = { col: columnIndex, row: rowIndex, styles: {} };
              json.styles[changeType] = reportChange;
              styleList.push(json);
            }
            hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer =
              'cellStylesRenderer';
          }
        }
      }
    }
  };

  /** 保存 保存数据结构 */
  const saveClickCallback = async () => {
    const count_col = hotRef.current.hotInstance.countCols(); /** 获取列数 **/
    const count_row = hotRef.current.hotInstance.countRows(); /** 获取行数 **/
    let row_h: any = [];
    let col_w: any = [];
    for (var i = 0; i < count_col; i++) {
      col_w.push(hotRef.current.hotInstance.getColWidth(i));
    }
    for (var k = 0; k < count_row; k++) {
      row_h.push(hotRef.current.hotInstance.getRowHeight(k));
    }
    let json = {
      data: hotRef.current.hotInstance.getData(),
      setting: {
        mergeCells:
          hotRef.current.hotInstance.getPlugin('mergeCells').mergedCellsCollection
            .mergedCells,
        cells: cells,
        styleList: styleList,
        classList: classList,
        customBorders: customBorders,
        row_h: row_h,
        col_w: col_w,
      },
    };
    sheetList[sheetIndex].data = json;
    const newData = Object.assign({}, sheetList);
    await current.update({
      ...current.metadata,
      reportDatas: JSON.stringify(newData),
    });
  };

  /** 点击单元格展示编辑特性 */
  const afterOnCellMouseDown = (event: any, coords: any) => {
    if (event) {
      let classJson = { styles: {}, class: {} };
      styleList?.forEach((item: any) => {
        if (item.row === coords.row && item.col === coords.col) {
          classJson.styles = item.styles;
        }
      });
      classList?.forEach((item: any) => {
        if (item.row === coords.row && item.col === coords.col) {
          classJson.class = item.class;
        }
      });
      const cellItem = cells.find(
        (it: any) => it.row === coords.row && it.col === coords.col,
      );
      if (cellItem) {
        setSelectAttr(cellItem);
        selectCellItem(cellItem);
      } else {
        setSelectAttr(undefined);
      }
      handEcho(classJson);
    }
  };

  /** 更新单元格特性 */
  const updateCells = (data: any, cellsData: any) => {
    cellsData.forEach((item: any) => {
      if (data.id === item.prop.id) {
        current.metadata.attributes.forEach((attr) => {
          if (item.prop.id === attr.id) {
            item.prop = attr;
          }
        });
        Object.keys(data.options).map((key) => {
          switch (key) {
            case 'readOnly':
              hotRef.current.hotInstance.setCellMeta(
                item.row,
                item.col,
                'readOnly',
                data.options[key],
              );
              break;
            case 'defaultValue':
              hotRef.current.hotInstance.setDataAtCell(
                item.row,
                item.col,
                data.options[key],
              );
              break;
            case 'max':
            case 'min':
              hotRef.current.hotInstance.setCellMeta(
                item.row,
                item.col,
                'validator',
                function (value: any, callback: any) {
                  setTimeout(() => {
                    if (value >= data.options['min'] && value <= data.options['max']) {
                      callback(true);
                    } else {
                      callback(false);
                    }
                  }, 100);
                },
              );
              break;
            case 'teamId':
              break;
            default:
              break;
          }
        });
      }
    });
  };

  /** 渲染特性背景色 **/
  registerRenderer('customStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#e1f3d8';
  });

  /** 删除特性背景色 **/
  registerRenderer('delStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#ffffff';
  });

  /** 渲染样式 **/
  registerRenderer('cellStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    const items = styleList.find((it: any) => it.row === rest[0] && it.col === rest[1]);
    const td: any = TD.style;
    if (items) {
      for (let key in items.styles) {
        if (key === 'paddingLeft') {
          td[key] = items.styles[key] + 'px';
        } else {
          td[key] = items.styles[key];
        }
      }
    }
  });

  /** 插入特性 */
  const setAttributes = (attribute: IProperty) => {
    const item = current.metadata.attributes.find(
      (it: any) => it.propId === attribute.id,
    );
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          let json: any = {
            col: columnIndex,
            row: rowIndex,
            prop: item,
          };
          cells.push(json);
          hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer =
            'customStylesRenderer';
        }
      }
    }
  };

  /** 删除特性 */
  const delSpeciality = () => {
    const index = current.metadata.attributes.findIndex(
      (it: any) => it.propId === selectAttr?.prop.id,
    );
    current.metadata.attributes.splice(index, 1);
    const selected = hotRef.current.hotInstance.getSelected() || [];
    for (let index = 0; index < selected.length; index += 1) {
      const [row1, column1, row2, column2] = selected[index];
      const startRow = Math.max(Math.min(row1, row2), 0);
      const endRow = Math.max(row1, row2);
      const startCol = Math.max(Math.min(column1, column2), 0);
      const endCol = Math.max(column1, column2);
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
        for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
          cells.forEach((items: { row: number; col: number }) => {
            if (items.row === rowIndex && items.col === columnIndex) {
              cells.splice(items);
            }
          });
          hotRef.current.hotInstance.getCellMeta(rowIndex, columnIndex).renderer =
            'delStylesRenderer';
        }
      }
    }
  };

  const getMenu = () => {
    const menu = {
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
    };
    let delMenu = {};
    if (selectAttr != undefined) {
      delMenu = {
        del_speciality: {
          name: '删除特性',
          callback: function () {
            delSpeciality();
          },
        },
      };
    }
    const newMenu = Object.assign(menu, delMenu);
    return newMenu;
  };

  return (
    <div>
      <HotTable
        ref={hotRef}
        customBorders={true}
        rowHeaders={true}
        colHeaders={true}
        manualColumnResize={true}
        manualRowResize={true}
        dropdownMenu={true}
        height="610px"
        language={zhCN.languageCode}
        persistentState={true}
        stretchH="all"
        multiColumnSorting={true}
        filters={true}
        manualRowMove={true}
        contextMenu={{
          items: getMenu(),
        }}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterOnCellMouseDown={afterOnCellMouseDown} //鼠标点击单元格边角后被调用
      />

      {modalType.includes('新增特性') && (
        <OpenFileDialog
          multiple
          title={`选择属性`}
          accepts={['属性']}
          rootKey={current.spaceKey}
          excludeIds={current.attributes.filter((i) => i.propId).map((a) => a.propId)}
          onCancel={() => setModalType('')}
          onOk={(files) => {
            (files as IProperty[]).forEach((item) => {
              current.metadata.attributes.push({
                propId: item.id,
                property: item.metadata,
                ...item.metadata,
                rule: '{}',
                options: {
                  visible: true,
                  isRequired: true,
                },
                formId: current.id,
                authId: orgAuth.SuperAuthId,
              });
              setAttributes(item);
            });
            setModalType('');
          }}
        />
      )}
    </div>
  );
};
export default HotTableView;
