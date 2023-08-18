import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import 'handsontable/dist/handsontable.min.css';
import { IReport } from '@/ts/core';
interface IProps {
  current: IReport;
}

const HotTableView: React.FC<IProps> = ({ current }) => {
  const [cells, setCells] = useState<any>([]);
  const [styleList, setStyleList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
  const [sheetIndex, setSheetIndex] = useState<string>('0');
  const hotRef: any = useRef(null);
  let sheetList = current.metadata?.rule ? JSON.parse(current.metadata?.rule) : [];
  let datas = sheetList[sheetIndex]?.data?.data || [[]];
  let setting = sheetList[sheetIndex]?.data?.setting || {};
  let mergeCells = setting?.mergeCells || [];
  let autoColumn: boolean = true; //自适应
  let autoRow: boolean = true;

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
  }, [sheetIndex]);

  const setValidator = (item: any, rules: any) => {
    hotRef.current.hotInstance.setCellMeta(
      item.row,
      item.col,
      'validator',
      function (value: any, callback: any) {
        setTimeout(() => {
          rules.forEach((items: any) => {
            const reg = new RegExp(items);
            if (reg.test(value)) {
              callback(true);
            } else {
              callback(false);
            }
          });
        }, 100);
      },
    );
  };

  const setEditor = (item: any) => {
    hotRef.current.hotInstance.setCellMeta(
      item.row,
      item.col,
      'editor',
      item.type,
    )
  }

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

  cells?.forEach((item: any) => {
    //渲染单元格颜色
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
      'customStylesRenderer';

    // 更新特性rules 但单元格只有只读属性 readOnly
    current.attributes.forEach((items: any) => {
      if (item.prop.propId === items.propId) {
        item.prop = items;
        let newRule = JSON.parse(item.prop.rule);
        if (newRule) {
          if (newRule.widget) {
            setEditor(item)
          }
          for (var key in newRule) {
            if (key === 'rules' && newRule['rules'].length > 0) {
              setValidator(item, newRule['rules']);
            } else if (key === 'min' || key === 'max') {
              hotRef.current.hotInstance.setCellMeta(
                item.row,
                item.col,
                'validator',
                function (value: any, callback: any) {
                  setTimeout(() => {
                    if (value >= newRule['min'] && value <= newRule['max']) {
                      callback(true);
                    } else {
                      callback(false);
                    }
                  }, 100);
                },
              );
            } else {
              hotRef.current.hotInstance.setCellMeta(
                item.row,
                item.col,
                key,
                newRule[key],
              );
            }
          }
        }
      }
    });
  });

  const onChange = (key: string) => {
    setSheetIndex(key);
  };

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const afterChange = (change: any, source: any) => {
    // 修改后
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

  const afterUpdateSettings = (change: any) => {
    console.log(change, 'change');
  };

  registerRenderer('customStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    //渲染特性背景色
    textRenderer(hotInstance, TD, ...rest);
    TD.style.background = '#e1f3d8';
  });

  registerRenderer('cellStylesRenderer', (hotInstance: any, TD: any, ...rest) => {
    //渲染样式
    textRenderer(hotInstance, TD, ...rest);
    let items = styleList.find((it: any) => it.row === rest[0] && it.col === rest[1]);
    let td: any = TD.style;
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
        height="770px"
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        autoColumnSize={autoColumn}
        autoRowSize={autoRow}
        multiColumnSorting={true}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterChange={afterChange}
        afterUpdateSettings={afterUpdateSettings}
        afterSetCellMeta={afterSetCellMeta}
      />
      <div>
        <Tabs
          tabPosition={'bottom'}
          type="card"
          onChange={onChange}
          items={sheetList.map((it: any, index: string) => {
            return {
              label: it.name,
              key: index,
            };
          })}
        />
      </div>
    </div>
  );
};
export default HotTableView;
