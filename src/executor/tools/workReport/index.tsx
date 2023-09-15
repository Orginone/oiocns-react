import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import { textRenderer, registerRenderer } from 'handsontable/renderers';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
import Handsontable from 'handsontable';
registerLanguageDictionary(zhCN);
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import 'handsontable/dist/handsontable.min.css';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import { WorkFormRulesType } from '@/ts/core/work/rules/workFormRules';
import { selectEditor } from './editor/select';

interface IProps {
  allowEdit: boolean;
  belong: IBelong;
  forms: schema.XForm[];
  data: model.InstanceDataModel;
  useformRule?: boolean;
  getFormData: (id: string) => model.FormEditData;
  onChanged?: (id: string, data: model.FormEditData, changedData?: Object) => void;
  ruleService?: WorkFormRulesType;
}

const ReportForms: React.FC<IProps> = (props) => {
  const [cells, setCells] = useState<any>([]);
  const [styleList, setStyleList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
  const [sheetIndex, setSheetIndex] = useState<string>('0');
  const [rowHeights, setRowHeights] = useState<any>([]);
  const [colWidths, setColWidths] = useState<any>([]);
  const [serviceData, setServiceData] = useState<any>();
  const reportData = props.forms[0];
  const formData = props.getFormData(reportData.id);
  const [reallyData, setReallyData] = useState(
    formData.after.length > 0 ? formData.after[0] : undefined,
  );
  const [readOnly, setReadOnly] = useState<boolean>(false); // 是否只读
  const hotRef: any = useRef(null);
  let sheetList: any = reportData?.rule ? JSON.parse(reportData?.rule) : {}; // 当前报表所有数据
  delete sheetList?.list;
  sheetList = Object.values(sheetList);
  const [selectItem, setSelectedItem] = useState<any>(sheetList[0]);
  const datas = selectItem?.data?.data || [[]]; // 当前sheet页数据
  const setting = selectItem?.data?.setting || {}; // 报表设置数据
  const mergeCells = setting?.mergeCells || []; // 合并单元格数据

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    hot.updateSettings({
      data: [[]],
    });
    Handsontable.editors.registerEditor('SelectEditor', selectEditor); // 还未完成同步组件
    setStyleList(setting?.styleList || []);
    setClassList(setting?.classList || []);
    setRowHeights(setting?.row_h || []);
    setColWidths(setting?.col_w || []);
    hot.updateSettings({
      data: datas,
      cell: cells,
      mergeCells: mergeCells,
    });
    if (props.allowEdit) {
      props?.ruleService && (props.ruleService.currentMainFormId = reportData.id);
      //初始化数据
      props?.ruleService?.collectData<{ formId: string; callback: (data: any) => void }>(
        'formCallBack',
        {
          formId: reportData.id,
          callback: (data: any) => {
            if (data) {
              setServiceData(data);
            }
          },
        },
      );
      kernel.createThing(props.belong.userId, [], '').then((res) => {
        if (res.success && res.data) {
          setReallyData(res.data);
        }
      });
      setCells(setting?.cells || []);
    } else {
      setReadOnly(true);
      if (reallyData) {
        Object.keys(reallyData).forEach((k) => {
          if (k.indexOf(',') != -1) {
            let arr = k.split(',');
            hot.setDataAtCell([[Number(arr[0]), Number(arr[1]), reallyData[k]]]);
          }
        });
      }
    }
  }, [sheetIndex]);

  const setValidator = (item: any, rules: any) => {
    // 设置单元格规则
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
    console.log(item, 'item');
    let valueType: string = JSON.parse(item.prop.rule).widget;
    let newType: string = '';
    switch (valueType) {
      case 'select':
      case 'dept':
      case 'person':
      case 'group':
        newType = 'select';
        setSelectOptions(item, valueType);
        break;
      case 'myself':
        newType = item.type;
        setData(item);
        break;
      default:
        newType = item.type;
        break;
    }
    hotRef.current.hotInstance.setCellMeta(item.row, item.col, 'editor', newType);
  };

  const setSelectOptions = (item: any, valueType: string) => {
    //给下拉框插入数据
    const belong = props.belong;
    let arr: any = [];
    switch (valueType) {
      case 'select':
        item.prop.lookups.map((ups: any) => {
          arr.push(ups.text);
        });
        break;
      case 'dept':
        belong.subTarget?.map((xtarget: any) => {
          arr.push(xtarget.name);
        });
        break;
      case 'person':
        belong.members?.map((xtarget: any) => {
          arr.push(xtarget.name);
        });
        break;
      case 'group':
        belong.parentTarget?.map((xtarget: any) => {
          arr.push(xtarget.name);
        });
        break;
      default:
        break;
    }
    hotRef.current.hotInstance.setCellMeta(item.row, item.col, 'selectOptions', arr);
  };

  const setData = (item: any) => {
    const belong = props.belong;
    hotRef.current.hotInstance.setDataAtCell(item.row, item.col, belong?.user.name);
  };

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

  cells?.forEach((item: any) => {
    if (serviceData) {
      Object.keys(serviceData).map((k) => {
        if (item.prop.id === k) {
          hotRef.current.hotInstance.setDataAtCell([
            [item.row, item.col, serviceData[k]],
          ]);
        }
      });
    }
    //渲染单元格颜色
    hotRef.current.hotInstance.getCellMeta(item.row, item.col).renderer =
      'customStylesRenderer';

    // 更新特性rules 但单元格只有只读属性 readOnly
    let newAttributes: any = [];
    for (var key in props.data.fields) {
      newAttributes = props.data.fields[key];
    }
    newAttributes.forEach((items: any) => {
      if (item.prop.id === items.id) {
        item.prop = items;
        let newRule = JSON.parse(item.prop.rule);
        if (newRule) {
          if (newRule.widget) {
            setEditor(item);
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

  const saveData = () => {
    // 提交数据 创建办事
    const data = hotRef.current.hotInstance.getData();
    const belong = props.belong;
    let localData: any = [];
    cells?.forEach((item: any) => {
      let json = { col: item.col, row: item.row, id: item.prop.id, data: '', type: '' };
      let newData: any = data[item.row][item.col];
      let items: any;
      let valueType: string = JSON.parse(item.prop.rule).widget;
      switch (valueType) {
        case 'select':
          items = item.prop.lookups.find((it: any) => it.text === newData);
          json.type = 'select';
          json.data = items?.id;
          break;
        case 'dept':
          json.type = 'dept';
          items = belong.subTarget.find((it: any) => it.name === newData);
          json.data = items?.id;
          break;
        case 'person':
          json.type = 'person';
          items = belong.members.find((it: any) => it.name === newData);
          json.data = items?.id;
          break;
        case 'group':
          json.type = 'group';
          items = belong.parentTarget.find((it: any) => it.name === newData);
          json.data = items?.id;
          break;
        case 'myself':
          json.type = 'myself';
          json.data = belong.user.userId;
          break;
        default:
          json.type = 'text';
          json.data = data[item.row][item.col];
          break;
      }
      localData.push(json);
    });
    data?.forEach((it: any, index: number) => {
      it?.forEach((its: any, ids: number) => {
        if (its) {
          let json = { id: [index, ids].toString(), data: its };
          localData.push(json);
        }
      });
    });
    let newArr: any = {};
    localData.map((item: any) => {
      newArr[item.id] = item.data;
    });
    let result = Object.assign({}, reallyData, newArr);
    formData.after = [result];
    props.onChanged?.apply(this, [reportData.id, formData]);
  };

  const onChange = (key: string) => {
    setSelectedItem(sheetList[key]);
    setSheetIndex(key);
  };

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const afterChange = (change: any, source: any) => {
    // 修改后
    if (source === 'edit') {
      saveData();
    }
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
        colWidths={colWidths}
        rowHeights={rowHeights}
        readOnly={readOnly}
        height="580px"
        language={zhCN.languageCode}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        multiColumnSorting={true}
        outsideClickDeselects={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterChange={afterChange}
      />
      <Tabs
        tabPosition={'bottom'}
        type="card"
        onChange={onChange}
        items={sheetList.map((it: any, index: number) => {
          return {
            label: it.name,
            key: index,
          };
        })}
      />
    </div>
  );
};
export default ReportForms;
