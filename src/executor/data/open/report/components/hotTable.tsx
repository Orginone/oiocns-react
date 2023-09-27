import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { HotTable } from '@handsontable/react';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import 'handsontable/dist/handsontable.min.css';
import { IForm } from '@/ts/core';
interface IProps {
  key: string;
  current: IForm; // 获取样式
  sheetList: any;
  selectItem: any; // 选中数据
}

// 数据还未获取,明细待完善
const HotTableView: React.FC<IProps> = ({ current, sheetList, selectItem }) => {
  const [cells, setCells] = useState<any>([]);
  const [styleList, setStyleList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
  const [sheetIndex, setSheetIndex] = useState<string>('0');

  const hotRef: any = useRef(null);

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    const datas = sheetList[sheetIndex]?.data?.data || [[]];
    const setting = sheetList[sheetIndex]?.data?.setting || {};
    const mergeCells = setting?.mergeCells || [];
    setCells(setting?.cells || []);
    setStyleList(setting?.styleList || []);
    setClassList(setting?.classList || []);
    hot.updateSettings({
      data: datas,
      cell: cells,
      mergeCells: mergeCells,
      rowHeights: setting?.row_h,
      colWidths: setting?.col_w,
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
  });

  const onChange = (key: string) => {
    setSheetIndex(key);
  };

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
        minCols={8}
        minRows={60}
        readOnly={true}
        rowHeaders={true}
        colHeaders={true}
        dropdownMenu={true}
        height="600px"
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
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
