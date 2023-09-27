import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { Modal } from 'antd';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import 'handsontable/dist/handsontable.min.css';
import SelectPropertys from '../../SelectPropertys';
import AttributeConfig from '../../FormDesign/attributeConfig';
import { IForm } from '@/ts/core';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { schema } from '@/ts/base';
interface IProps {
  current: IForm;
  sheetList: any;
  selectItem: any;
  reportChange: any;
  changeType: string;
  classType: any | undefined;
  handEcho: (cellStyle: any) => void;
}

const HotTableView: React.FC<IProps> = ({
  current,
  sheetList,
  selectItem,
  reportChange,
  changeType,
  classType,
  handEcho,
}) => {
  const [modalType, setModalType] = useState<string>('');
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [sheetIndex, setSheetIndex] = useState<any>(0); // tabs页签
  const [selectedItem, setSelectedItem] = useState<schema.XAttribute>();
  const [cells, setCells] = useState<any>([]);
  const [styleList, setStyleList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
  const initRowCount: number = 8;
  const initColCount: number = 60;
  const defaultRowHeight: number = 23;
  const defaultColWidth: number = 50;

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
  const hotRef: any = useRef(null); // ref

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    /** hot.clear之后会全选报表所有用的update */
    hot.updateSettings({
      data: [[]],
    });
    /** 获取当前sheet页下标 */
    const index = sheetList.findIndex((it: any) => it.code === selectItem.code);
    setSheetIndex(index);
    const setting = sheetList[index]?.data?.setting || {};
    const mergeCells = setting?.mergeCells || [];
    /** 初始化行高和列宽 */
    const row_h = [];
    for (let i = 0; i < initColCount; i += 1) {
      row_h.push(defaultRowHeight);
    }
    const col_w = [];
    for (let j = 0; j < initRowCount; j += 1) {
      col_w.push(defaultColWidth);
    }
    setCells(setting?.cells || []);
    setStyleList(setting?.styleList || []);
    setClassList(setting?.classList || []);
    hot.updateSettings({
      data: sheetList[index]?.data?.data,
      cell: cells,
      mergeCells: mergeCells,
      rowHeights: setting?.row_h || row_h,
      colWidths: setting?.col_w || col_w,
    });
  }, [selectItem]);

  useEffect(() => {
    if (changeType !== '' && changeType !== 'onSave') {
      buttonClickCallback();
    } else if (changeType == 'onSave') {
      saveClickCallback();
    }
  }, [reportChange]);

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

  /** 工具栏按钮点击 */
  const buttonClickCallback = () => {
    const selected = hotRef.current.hotInstance.getSelected() || [];
    hotRef.current.hotInstance.suspendRender();
    if (changeType === 'border') {
      const customBordersPlugin = hotRef.current.hotInstance.getPlugin('customBorders');
      if (classType !== 'none') {
        customBordersPlugin.setBorders(hotRef.current.hotInstance.getSelectedRange(), {
          [classType]: { hide: false, width: 1, color: '#000000' },
        });
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
          } else if (changeType !== 'border') {
            if (styleList.length > 0) {
              let items = styleList.find(
                (it: any) => it.col === columnIndex && it.row === rowIndex,
              );
              if (items) {
                for (let k in items.styles) {
                  if (k === changeType) {
                    items.styles[k] = reportChange;
                  } else {
                    items.styles[changeType] = reportChange;
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
    hotRef.current.hotInstance.render();
    hotRef.current.hotInstance.resumeRender();
  };

  /** 保存 保存数据结构---还未更新完 */
  const saveClickCallback = async () => {
    const count_col = hotRef.current.hotInstance.countCols(); /** 获取列数 **/
    const count_row = hotRef.current.hotInstance.countRows(); /** 获取行数 **/
    let row_h: any = [];
    let col_w: any = [];
    for (var i = 0; i < count_col; i++) {
      col_w.push(hotRef.current.hotInstance.getColWidth(i));
    }
    for (var k = 0; k < count_row; k++) {
      row_h.push(hotRef.current.hotInstance.getRowHeight(i));
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
        row_h: row_h,
        col_w: col_w,
      },
    };
    sheetList[sheetIndex].data = json;
    const newData = Object.assign({}, sheetList);
    await current.update({
      ...current.metadata,
      rule: JSON.stringify(newData),
    });
  };

  /** 插入特性 */
  const saveSpeciality = (prop: schema.XAttribute) => {
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

  /** 更新特性rules 但单元格只有只读属性 readOnly */
  const upDataCell = () => {
    cells.forEach((item: any) => {
      current.attributes.forEach((items: any) => {
        if (item.prop.propId === items.propId) {
          item.prop = items;
          const newRule = JSON.parse(item.prop.rule);
          if (newRule) {
            Object.keys(newRule).map((key) => {
              hotRef.current.hotInstance.setCellMeta(
                item.row,
                item.col,
                key,
                newRule[key],
              );
            });
          }
        }
      });
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
      cells?.forEach((item: any) => {
        if (item.row === coords.row && item.col === coords.col) {
          setSelectedItem(item.prop);
          setModalType('配置特性');
        }
      });
      handEcho(classJson);
    }
  };

  /** 渲染特性背景色 **/
  registerRenderer('customStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#e1f3d8';
  });

  /** 渲染样式 **/
  registerRenderer('cellStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);
    const items = styleList.find((it: any) => it.row === rest[0] && it.col === rest[1]);
    const td: any = TD.style;
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
        minCols={initRowCount}
        minRows={initColCount}
        rowHeaders={true}
        colHeaders={true}
        dropdownMenu={true}
        height="610px"
        language={zhCN.languageCode}
        persistentState={true}
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
          onCancel={() => setModalType('')}>
          <SelectPropertys
            target={current.directory.target}
            selected={current.attributes.map((a: any) => a.property!)}
            onAdded={async (prop: any) => {
              let res = await current.createAttribute(
                {
                  name: prop.name,
                  code: prop.code,
                  rule: '{}',
                  remark: prop.remark,
                } as schema.XAttribute,
                prop,
              );
              if (res) {
                saveSpeciality(res);
              }
            }}
            onDeleted={async (id: any) => {
              const attr = current.attributes.find((i) => i.propId === id);
              if (attr) {
                await current.deleteAttribute(attr);
              }
            }}
          />
        </Modal>
      )}

      {/** 编辑特性模态框 */}
      {modalType.includes('配置特性') && selectedItem && (
        <AttributeConfig
          key={tkey}
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
