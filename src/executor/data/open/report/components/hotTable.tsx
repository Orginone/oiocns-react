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
import { IForm } from '@/ts/core';
interface IProps {
  current: IForm; // 获取样式
  info: any // 数据
}

// 数据还未获取,明细待完善
const HotTableView: React.FC<IProps> = ({ current, info }) => {
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

  styleList?.forEach((item: any) => {
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
      'cellStylesRenderer';
  });

  classList?.forEach((item: any) => {
    let arr = [];
    let items: any = item.class;
    for (let k in items) {
      arr.push(items[k]);
    }
    hotRef.current.hotInstance.setCellMeta(
      item.row,
      item.col,
      'className',
      arr.join(' '),
    );
  })

  const onChange = (key: string) => {
    setSheetIndex(key);
  };

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div>
      <HotTable
        ref={hotRef}
        formulas={{
          engine: hyperformulaInstance,
        }}
        minCols={8}
        minRows={60}
        readOnly={true}
        rowHeaders={true}
        colHeaders={true}
        dropdownMenu={true}
        height="670px"
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        autoColumnSize={autoColumn}
        autoRowSize={autoRow}
        multiColumnSorting={true}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only 
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
