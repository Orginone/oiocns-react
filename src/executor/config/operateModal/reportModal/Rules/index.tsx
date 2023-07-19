import React, { useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { IForm } from '@/ts/core';
import AttributeConfig from '@/bizcomponents/FormDesign/attributeConfig';
import { ProColumns } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';

interface IProps {
  current: IForm;
  modalType: string;
  recursionOrg: boolean;
  setModalType: (modalType: string) => void;
}


/**
 * @description: 表报页标准
 * @return {*}
 */
const Rules = ({ current, modalType, setModalType }: IProps) => {
  const [tkey, tforceUpdate] = useObjectUpdate('');
  const [selectedItem, setSelectedItem] = useState<any>();
  const [rulesList, setRulesList] = useState<any>([]);
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
  const renderOperate = (item: any) => {
    if (!current.directory.isInherited) {
      return [
        {
          key: '编辑规则',
          label: '编辑规则',
          onClick: () => {
            setSelectedItem(item);
            setModalType('编辑规则');
          },
        },
        {
          key: '删除',
          label: <span style={{ color: 'red' }}>删除</span>,
          onClick: async () => {
            let index = rulesList.findIndex((it:any)=>{ return it.code === item.code})
            rulesList.splice(index,1)
            tforceUpdate();
          },
        },
      ];
    } 
  };
  const RulesColumns = (): ProColumns<any>[] => [
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
      title: '指向',
      dataIndex: 'point',
      key: 'point',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
    },
  ];

  const columns:any = [
    {
      title: '规则编号',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '规则编号为必填项' }],
      },
    },
    {
      title: '规则指向',
      dataIndex: 'point',
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: '规则指向为必填项' }],
      },
      fieldProps: {
        options: [
          {
            value: 'all',
            label: '全部',
          }
        ],
      },
    },
    {
      title: '规则类型',
      dataIndex: 'type',
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: '规则类型为必填项' }],
      },
      fieldProps: {
        options: [
          {
            value: 'all',
            label: '全部',
          }
        ],
      },
    },
    {
      title: '规则内容',
      dataIndex: 'content',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '规则内容为必填项' }],
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
        columns={RulesColumns()}
        showChangeBtn={false}
        dataSource={rulesList}
      />
      {/** 新增规则模态框 */}
      {['新增规则', '编辑规则'].includes(modalType) && (
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
            setRulesList((current:any) => [...current,values])
            setModalType('');
            tforceUpdate()
        }}></SchemaForm>  
      )}
      {/** 编辑特性模态框 */}
      {modalType.includes('修改规则') && selectedItem && (
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
export default Rules;
