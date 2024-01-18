import React, { useState } from 'react';
import { IForm } from '@/ts/core';
import CardOrTableComp from '@/components/CardOrTableComp';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Dropdown, Card, Typography, Popconfirm } from 'antd';
import CalcRuleModal from './modal/calc';
import ShowRuleModal from './modal/show';
import ShowAttributeModal from './modal/attribute'
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { model } from '@/ts/base';
import { FieldInfo } from '@/ts/base/model';
import { PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface IProps {
  form: IForm;
  fields: FieldInfo[];
}

const FormRule: React.FC<IProps> = (props) => {
  if (props.form.metadata.rule == undefined) {
    props.form.metadata.rule = [];
  }
  const [key, forceUpdate] = useObjectUpdate(props.fields);
  const [openType, setOpenType] = useState(0);
  const [data, setData] = useState<model.Rule[]>(props.form.metadata.rule);
  const [select, setSelect] = useState<model.Rule>();
  /** 展示规则信息列 */
  const ShowRuleColumns: ProColumns<model.Rule>[] = [
    { title: '序号', valueType: 'index', width: 50 },
    { title: '名称', dataIndex: 'name', },
    {
      title: '类型',
      dataIndex: 'type',
      render: (_: any, record: model.Rule) => {
        switch (record.type) {
          case 'show':
            return '渲染规则';
          case 'calc':
            return '计算规则';
          case 'attribute':
            return '属性筛选';
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
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => {  setSelect(undefined); setOpenType(1); }}>渲染规则</div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => {  setSelect(undefined); setOpenType(2); }}>计算规则</div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => { setSelect(undefined); setOpenType(3); }}>属性筛选</div>
      ),
    }
  ];
  const config: { [propName: string | number]: number} = {
    'show': 1,
    'calc': 2,
    'attribute': 3,
  };
  const renderOperate = (rule: model.Rule) => {
    return [
      <Button type="link" size="small" onClick={ () => {
        setSelect(rule);
        setOpenType(config[rule.type])
      }}>编辑</Button>,
      <Popconfirm
        title="确定删除吗？"
        onConfirm={() => {
          const newdata = data.filter((a) => a.id != rule.id);
          setData(newdata);
          props.form.metadata.rule = newdata;
          forceUpdate();
        }}
      >
        <Button type="text" size="small" danger>删除</Button>
      </Popconfirm>
    ];
  };

  return (
    <>
      <Card
        type="inner"
        title="规则配置"
        extra={
          <>
          <Dropdown menu={{ items }} placement="bottomLeft">
            <Button type="primary" icon={<PlusOutlined />}>新建规则</Button>
          </Dropdown>
          </>
        }>
        <CardOrTableComp<model.Rule>
          key={key}
          rowKey={'id'}
          dataSource={data}
          scroll={{ y: 'calc(60vh - 150px)' }}
          columns={ShowRuleColumns}
          showBtnType='unfold'
          operation={renderOperate}
        />
      </Card>
      {openType == 1 && (
        <ShowRuleModal
          fields={props.fields}
          onCancel={() => setOpenType(0)}
          current={select as model.FormShowRule}
          onOk={(rule) => {
            var rules = [rule, ...data.filter((a) => a.id != rule.id)];
            setOpenType(0);
            setData(rules);
            props.form.metadata.rule = rules;
            forceUpdate();
          }}
        />
      )}
      {openType == 2 && (
        <CalcRuleModal
          fields={props.fields}
          onCancel={() => setOpenType(0)}
          current={select as model.FormCalcRule}
          onOk={(rule) => {
            var rules = [rule, ...data.filter((a) => a.id != rule.id)];
            setOpenType(0);
            setData(rules);
            props.form.metadata.rule = rules;
            forceUpdate();
          }}
        />
      )}
      {openType == 3 && (
        <ShowAttributeModal
          fields={props.fields}
          onCancel={() => setOpenType(0)}
          current={select as model.AttributeFilterRule}
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
