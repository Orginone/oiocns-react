import React, { useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IReport } from '@/ts/core';
import { ProColumns } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import ReportView from '@/executor/data/open/report';
import { model } from '@/ts/base';

interface IProps {
  current: IReport;
  modalType: string;
  recursionOrg: boolean;
  setModalType: (modalType: string) => void;
  finished: () => void;
}

/**
 * @description: 表报页标准
 * @return {*}
 */
const Sheet = ({ current, modalType, setModalType }: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [selectedItem, setSelectedItem] = useState<any>();
  let sheetList = current.metadata?.rule ? JSON.parse(current.metadata?.rule) : [];

  // 操作内容渲染函数
  const renderOperate = (item: any) => {
    const operates = [
      {
        key: '打开',
        label: '打开',
        onClick: () => {
          setSelectedItem(item);
          setModalType('配置sheet页');
        },
      },
      {
        key: '删除',
        label: <span style={{ color: 'red' }}>删除</span>,
        onClick: async () => {
          let index = sheetList.findIndex((it: any) => {
            return it.code === item.code;
          });
          sheetList.splice(index, 1);
          await current.update({
            id: current.id,
            name: current.name,
            code: current.code,
            rule: JSON.stringify(sheetList),
          } as model.FormModel);
          tforceUpdate();
        },
      },
    ];
    return operates;
  };
  const SheetColumns = (): ProColumns<any>[] => [
    {
      title: '序号',
      valueType: 'index',
      width: 50,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
  ];

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
    <>
      <CardOrTable
        key={tkey}
        rowKey={'id'}
        params={tkey}
        operation={renderOperate}
        columns={SheetColumns()}
        showChangeBtn={false}
        dataSource={sheetList}
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
            sheetList = [...sheetList, values];
            await current.update({
              id: current.id,
              name: current.name,
              code: current.code,
              rule: JSON.stringify(sheetList),
            } as model.FormModel);
            setModalType('');
            tforceUpdate();
          }}
        ></SchemaForm>
      )}

      {['配置sheet页'].includes(modalType) && (
        <ReportView
          current={current}
          selectItem={selectedItem}
          finished={async () => {
            setModalType('');
          }}
        ></ReportView>
      )}
    </>
  );
};
export default Sheet;
