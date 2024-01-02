import React, { useState } from 'react';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ProColumns } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import CalcRuleModal from './modal/calc';
import ShowRuleModal from './modal/show';
import { model, schema } from '@/ts/base';
import { WorkNodeModel } from '@/ts/base/model';
import { Field } from 'devextreme/ui/filter_builder';
import { Form } from '@/ts/core/thing/standard/form';
import { IWork } from '@/ts/core';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import ExecutorRuleModal from './modal/executor';
interface IProps {
  work: IWork;
  current: WorkNodeModel;
  primaryForms: schema.XForm[];
  detailForms: schema.XForm[];
}

const NodeRule: React.FC<IProps> = (props) => {
  const [key, rulesUpdate] = useObjectUpdate(props.current.formRules);
  const [fields, setFields] = useState<Field[]>([]);
  const [openType, setOpenType] = useState(0);
  const [select, setSelect] = useState<model.Rule>();
  const [loaded] = useAsyncLoad(async () => {
    const fields: Field[] = [];
    for (const xform of props.primaryForms) {
      const form = new Form({ ...xform, id: xform.id + '_' }, props.work.directory);
      const xfields = await form.loadFields();
      fields.push(
        ...(xfields.map((a) => {
          const name = `${form.name}--${a.name}`;
          switch (a.valueType) {
            case '数值型':
              return {
                name: xform.id + '-' + a.id,
                caption: name,
                formId: xform.id,
                dataField: a.code,
                dataType: 'number',
              };
            case '日期型':
              return {
                name: xform.id + '-' + a.id,
                caption: name,
                dataField: a.code,
                dataType: 'date',
              };
            case '时间型':
              return {
                name: xform.id + '-' + a.id,
                caption: name,
                formId: xform.id,
                dataField: a.code,
                dataType: 'datetime',
              };
            case '选择型':
            case '分类型':
              return {
                name: xform.id + '-' + a.id,
                caption: name,
                dataField: a.code,
                dataType: 'string',
                lookup: {
                  displayExpr: 'text',
                  valueExpr: 'value',
                  allowClearing: true,
                  dataSource: a.lookups,
                },
              };
            default:
              return {
                name: xform.id + '-' + a.id,
                caption: name,
                dataField: xform.id + '-' + a.id,
                dataType: 'string',
              };
          }
        }) as Field[]),
      );
    }
    setFields(fields);
  }, [props.primaryForms, props.detailForms]);
  if (!loaded) return <></>;
  /** 展示规则信息列 */
  const ruleColumns: ProColumns<model.Rule>[] = [
    { title: '序号', valueType: 'index', width: 50 },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (_: any, record: model.Rule) => {
        switch (record.type) {
          case 'show':
            return '渲染';
          case 'calc':
            return '计算';
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'display',
      render: (_: any, record: model.Rule) => {
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
  const renderOperate = (rule: model.Rule) => {
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
          props.current.formRules = props.current.formRules.filter(
            (a) => a.id != rule.id,
          );
          rulesUpdate();
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
            {fields && fields?.length > 0 && (
              <>
                <a
                  style={{ padding: 5 }}
                  onClick={() => {
                    setSelect(undefined);
                    setOpenType(1);
                  }}>
                  添加渲染规则
                </a>
                <a
                  style={{ padding: 5 }}
                  onClick={() => {
                    setSelect(undefined);
                    setOpenType(2);
                  }}>
                  添加计算规则
                </a>
              </>
            )}
          </>
        }>
        <CardOrTableComp<model.Rule>
          key={key}
          rowKey={'id'}
          dataSource={props.current.formRules}
          scroll={{ y: 'calc(60vh - 150px)' }}
          columns={ruleColumns}
          operation={renderOperate}
        />
      </Card>
      {openType == 1 && (
        <ShowRuleModal
          fields={fields}
          primarys={props.current.primaryForms}
          details={props.current.detailForms}
          onCancel={() => setOpenType(0)}
          current={select as model.NodeShowRule}
          onOk={(rule) => {
            setOpenType(0);
            props.current.formRules = [
              rule,
              ...props.current.formRules.filter((a) => a.id != rule.id),
            ];
            rulesUpdate();
          }}
        />
      )}
      {openType == 2 && (
        <CalcRuleModal
          primarys={props.primaryForms}
          details={props.current.detailForms}
          onCancel={() => setOpenType(0)}
          current={select as model.NodeCalcRule}
          onOk={(rule) => {
            setOpenType(0);
            props.current.formRules = [
              rule,
              ...props.current.formRules.filter((a) => a.id != rule.id),
            ];
            rulesUpdate();
          }}
        />
      )}
      {openType == 3 && (
        <ExecutorRuleModal
          fields={fields}
          details={props.current.detailForms}
          onCancel={() => setOpenType(0)}
          current={select as model.NodeExecutorRule}
          onOk={(rule) => {
            setOpenType(0);
            props.current.formRules = [
              rule,
              ...props.current.formRules.filter((a) => a.id != rule.id),
            ];
            rulesUpdate();
          }}
        />
      )}
    </>
  );
};
export default NodeRule;
