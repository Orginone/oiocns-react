import React, { useState, useEffect } from 'react';
import HotTableView from './components/hotTable';
import ToolBar from './components/tool';
import cls from './index.module.less';
import { IForm } from '@/ts/core';
import { Tabs } from 'antd';
import SchemaForm from '@/components/SchemaForm';
import useObjectUpdate from '@/hooks/useObjectUpdate';
interface IProps {
  current: IForm;
  finished: () => void;
}

const ReportDesign: React.FC<IProps> = ({ current }) => {
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [sheetIndex, setSheetIndex] = useState<any>(0); // tabs页签
  const [reportChange, setReportChange] = useState<any>();
  const [changeType, setChangeType] = useState<string>('');
  const [classType, setClassType] = useState<string | undefined>('');
  const [modalType, setModalType] = useState<string>('');
  const [sheetList, setSheetList] = useState<any>([]);
  const [selectItem, setSelectedItem] = useState<any>();
  const [cellStyle, setCellStyle] = useState<any>();

  useEffect(() => {
    /** 获取报表数据，没有数据默认给个sheet页 */
    let sheetListData: any = current.metadata?.rule
      ? JSON.parse(current.metadata?.rule)
      : { 0: { name: 'sheet1', code: 'test1' } };
    delete sheetListData?.list;
    setSheetList(Object.values(sheetListData));
    setSelectedItem(sheetListData[0]);
  }, []);

  /** tabs切换 */
  const onChange = (key: string) => {
    setSheetIndex(key);
    setSelectedItem(sheetList[key]);
  };

  /** tabs操作新增删除 */
  const onEdit = async (targetKey: string | any, action: 'add' | 'remove') => {
    if (action === 'add') {
      setModalType('新增sheet页');
    } else {
      sheetList.splice(targetKey, 1);
      setSheetList(sheetList);
      const newData = Object.assign({}, sheetList);
      await current.update({
        ...current.metadata,
        rule: JSON.stringify(newData),
      });
      tforceUpdate();
    }
  };

  /** 新增sheet页 */
  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编号',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编号为必填项' }],
      },
    },
  ];

  return (
    <div className={cls['report-content-box']}>
      <div className={cls['report-tool-box']}>
        <ToolBar
          cellStyle={cellStyle}
          handClick={(value: string | any, type: string, classType?: any) => {
            setReportChange(value);
            setChangeType(type);
            setClassType(classType);
          }}></ToolBar>
      </div>
      <HotTableView
        current={current}
        handEcho={(cellStyle: any) => {
          /** 单元格样式回显到工具栏 */
          setCellStyle(cellStyle);
        }}
        selectItem={selectItem}
        sheetList={sheetList}
        reportChange={reportChange}
        changeType={changeType}
        classType={classType}></HotTableView>
      <Tabs
        key={tkey}
        tabPosition={'bottom'}
        type="editable-card"
        activeKey={sheetIndex}
        onEdit={onEdit}
        onChange={onChange}
        items={sheetList.map((it: any, index: number) => {
          return {
            label: it.name,
            key: index,
          };
        })}
      />

      {/** 新增sheet页模态框 */}
      {['新增sheet页', '编辑sheet页'].includes(modalType) && (
        <SchemaForm
          open
          title={modalType}
          width={640}
          columns={columns}
          rowProps={{
            gutter: [24, 0],
          }}
          layoutType="ModalForm"
          onOpenChange={(open: boolean) => {
            if (!open) {
              setModalType('');
            }
          }}
          onFinish={async (values) => {
            setSheetList([...sheetList, values]);
            const newData = Object.assign({}, sheetList);
            await current.update({
              ...current.metadata,
              rule: JSON.stringify(newData),
            });
            setModalType('');
            tforceUpdate();
          }}></SchemaForm>
      )}
    </div>
  );
};
export default ReportDesign;
