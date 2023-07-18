import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { XAttribute } from '@/ts/base/schema';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IForm } from '@/ts/core';
import AttributeConfig from '@/bizcomponents/FormDesign/attributeConfig';
import { ProColumns } from '@ant-design/pro-components';

interface IProps {
  current: IForm;
  modalType: string;
  recursionOrg: boolean;
  setModalType: (modalType: string) => void;
}

const sheetList:any = [
  {
    index:'1',
    code:'1',
    name:'sheet1'
  }
]

/**
 * @description: 表报标准
 * @return {*}
 */
const Sheet = ({ current, modalType, setModalType }: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [selectedItem, setSelectedItem] = useState<XAttribute>();
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
  // 操作内容渲染函数
  const renderOperate = (item: XAttribute) => {
    if (!current.directory.isInherited) {
      return [
        {
          key: '编辑特性',
          label: '编辑特性',
          onClick: () => {
            setSelectedItem(item);
            setModalType('编辑特性');
          },
        },
        {
          key: '配置特性',
          label: '配置特性',
          onClick: () => {
            setSelectedItem(item);
            setModalType('配置特性');
          },
        },
        {
          key: '删除特性',
          label: <span style={{ color: 'red' }}>删除特性</span>,
          onClick: async () => {
            if (await current.deleteAttribute(item)) {
              tforceUpdate();
            }
          },
        },
      ];
    } else {
      return [
        {
          key: '关联属性',
          label: '关联属性',
          onClick: () => {
            setSelectedItem(item);
            setModalType('关联属性');
          },
        },
        {
          key: '复制属性',
          label: '复制属性',
          onClick: async () => {
            setSelectedItem(item);
            setModalType('复制属性');
          },
        },
      ];
    }
  };
  const SheetColumns = (): ProColumns<XAttribute>[] => [
    {
      title: '序号',
      valueType: 'index',
      width: 50,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
  ];

  useEffect(() => {
    if(modalType && modalType === '新增sheet页'){
      let json = {index:sheetList.length+1,code:sheetList.length+1,name:'sheet' + (sheetList.length+1)}
      sheetList.push(json)
      tforceUpdate();
    }
  })

  return (
    <>
      <CardOrTable<XAttribute>
        key={tkey}
        rowKey={'id'}
        params={tkey}
        operation={renderOperate}
        columns={SheetColumns()}
        showChangeBtn={false}
        dataSource={sheetList}
      />
      {/** 新增特性模态框 */}
      {/* {['新增Sheet', '编辑特性'].includes(modalType) && (
        
      )} */}
      {/** 编辑特性模态框 */}
      {modalType.includes('配置特性') && selectedItem && (
        <AttributeConfig
          attr={selectedItem}
          onChanged={formValuesChange}
          onClose={() => {
            setSelectedItem(undefined);
            setModalType('');
            tforceUpdate();
          }}
          superAuth={current.directory.target.space.superAuth!.metadata}
        />
      )}
    </>
  );
};
export default Sheet;
