import React, { useState } from 'react';
import { IForm } from '@/ts/core';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ProColumns } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import { Field } from 'devextreme/ui/filter_builder';
import CalcRuleModal from './modal/calc';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { schema } from '@/ts/base';
interface IProps {
  form: IForm;
  fields: Field[];
}

const FormRule: React.FC<IProps> = (props) => {
  if (props.form.metadata.rule == undefined) {
    props.form.metadata.rule = [];
  }
  const [key, forceUpdate] = useObjectUpdate(props.fields);
  const [openType, setOpenType] = useState(0);
  const [data, setData] = useState<schema.XFormRule1[]>(props.form.metadata.rule);
  const [select, setSelect] = useState<schema.XFormRule1>();
  /** 展示规则信息列 */
  const ShowRuleColumns: ProColumns<schema.XFormRule1>[] = [
    { title: '序号', valueType: 'index', width: 50 },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'display',
      render: (_: any, record: schema.XFormRule1) => {
        return (
          <Typography.Text
            style={{ fontSize: 12, color: '#888' }}
            title={record.remark}
            ellipsis>
            {record.remark}
          </Typography.Text>
        );
      },
    },
  ];
  const renderOperate = (rule: schema.XFormRule1) => {
    return [
      {
        key: 'edit',
        label: <span>编辑</span>,
        onClick: () => {
          setSelect(rule);
          setOpenType(rule.type == 'show' ? 1 : 2);
        },
      },
      {
        key: 'remove',
        label: <span style={{ color: 'red' }}>删除</span>,
        onClick: () => {
          const newdata = data.filter((a) => a.id != rule.id);
          setData(newdata);
          props.form.metadata.rule = newdata;
          forceUpdate();
        },
      },
    ];
  };
  return (
    <>
      <Card
        type="inner"
        title="渲染规则配置"
        extra={
          <>
            <a
              style={{ padding: 5 }}
              onClick={() => {
                setSelect(undefined);
                setOpenType(1);
              }}>
              添加计算规则
            </a>
          </>
        }>
        <CardOrTableComp<schema.XFormRule1>
          key={key}
          rowKey={'id'}
          dataSource={data}
          scroll={{ y: 'calc(60vh - 150px)' }}
          columns={ShowRuleColumns}
          operation={renderOperate}
        />
      </Card>
      {openType == 1 && (
        <CalcRuleModal
          fields={props.fields}
          onCancel={() => setOpenType(0)}
          current={select as schema.FormCalcRule}
          onOk={(rule) => {
            var rules = [rule, ...data.filter((a) => a.id != rule.id)];
            setOpenType(0);
            setData(rules);
            props.form.metadata.rule = rules;
            forceUpdate();
          }}
        />
      )}
    </>
  );
};
export default FormRule;
