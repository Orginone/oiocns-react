import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';

import CodeEdit from '@/components/Common/ReactCodeEdit';
import { XAttribute, XFormRule } from '@/ts/base/schema';
import { Input } from 'antd';
import { EffectEnum, EffectEnumOption } from '@/ts/core/work/rules/base/enum';

/** 规则运行类型 */
export const trigger: { [key: string]: string } = {
  Start: '初始化', //首次加载表单时触发
  Running: '运行时', //依赖项变更时触发
  Submit: '提交时', //表单提交时触发
  ThingsChanged: '子表变化', //表单提交时触发
};
export const FormRuleType: { [key: string]: string } = {
  formula: '公式', //计算相关
  method: '函数体', //依赖项变更时触发
};

const GoalsOpt = Object.keys(EffectEnum).map((v) => {
  return { label: EffectEnumOption[v], value: v };
});

const getColumns: (
  attrs: XAttribute[],
  sysRules?: any[],
) => ProFormColumnsType<XFormRule>[] = (attrs, sysRules = []) => [
  {
    title: '规则编号',
    dataIndex: 'code',
    formItemProps: {
      rules: [{ required: true, message: '规则编号为必填项' }],
    },
  },
  {
    title: '模板类型',
    dataIndex: 'modalType',
    valueType: 'radio',
    initialValue: 'common',
    fieldProps: {
      options: [
        {
          label: '通用模板',
          value: 'common',
        },
        {
          label: '自定义',
          value: 'custom',
        },
      ],
    },
  },
  {
    title: '规则名称',
    dataIndex: 'name',
    formItemProps: {
      rules: [{ required: true, message: '规则名称为必填项' }],
    },
  },
  {
    title: '触发类型',
    dataIndex: 'trigger',
    valueType: 'select',
    initialValue: 'Start',
    fieldProps: {
      options: Object.keys(trigger).map((item) => {
        return {
          value: item,
          label: trigger[item],
        };
      }),
    },
    formItemProps: {
      rules: [{ required: true, message: '规则触发类型为必填项' }],
    },
  },
  {
    title: '目标属性',
    tooltip: '规则计算结果的赋值目标',
    dataIndex: 'targetId',
    valueType: 'select',
    colProps: {
      span: 12,
    },
    fieldProps: {
      fieldNames: { label: 'name', value: 'id' },
      options: attrs,
      // options: attrs,
    },
    formItemProps: {
      rules: [{ required: true, message: '目标属性为必填项' }],
    },
  },
  {
    title: '规则效果类别',
    tooltip: '规则执行后的作用效果',
    dataIndex: 'effect',
    valueType: 'select',
    initialValue: '0',
    colProps: {
      span: 12,
    },
    fieldProps: {
      // fieldNames: { label: 'name', value: 'id' },
      options: GoalsOpt,
    },
    formItemProps: {
      rules: [{ required: true, message: '效果类别为必填项' }],
    },
  },
  {
    valueType: 'dependency',
    name: ['modalType', 'trigger'],
    columns: ({ modalType, trigger }) => {
      return modalType === 'custom'
        ? [
            {
              title: '规则类型',
              dataIndex: 'ruleType',
              valueType: 'select',
              fieldProps: {
                options: Object.keys(FormRuleType).map((item) => {
                  return {
                    value: item,
                    label: FormRuleType[item],
                  };
                }),
              },
              formItemProps: {
                rules: [{ required: true, message: '规则类型为必填项' }],
              },
            },
            {
              title: '错误提示词',
              dataIndex: 'errMsg',
              valueType: 'text',
              tooltip: '规则验证失败时，展示的提示内容',
              colProps: { span: 24 },
            },
            {
              title: '规则描述',
              dataIndex: 'remark',
              // valueType: 'textarea',
              colProps: { span: 24 },
            },
            {
              valueType: 'dependency',
              name: ['ruleType'],
              columns: ({ ruleType }) => {
                if (ruleType === 'method') {
                  return [
                    {
                      title: '函数体',
                      dataIndex: 'content',
                      valueType: 'textarea',
                      tooltip:
                        '$formData:获取表单数据；$attrs:获取当前表单可用特性；$company:获取当前单位数据；$user:获取用户信息；$things:获取子表数据',
                      colProps: { span: 24 },
                      renderFormItem: (_schema, _config, _form) => {
                        return (
                          <CodeEdit
                            defaultVal={_config as any}
                            onCodeChange={(code: string) =>
                              _form.setFieldValue('content', code)
                            }
                          />
                        );
                      },
                    },
                  ];
                }

                if (ruleType === 'formula') {
                  return [
                    {
                      title: '规则定义',
                      tooltip:
                        '$formData:获取表单数据；$attrs:获取当前表单可用特性；$company:获取当前单位数据；$user:获取用户信息；$things:获取子表数据',
                      dataIndex: 'content',
                      valueType: 'textarea',
                      colProps: { span: 24 },
                      formItemProps: {
                        rules: [{ required: true, message: '规则定义为必填项' }],
                      },
                    },
                  ];
                }

                return [];
              },
            },
            {
              title: '关联表单属性',
              valueType: 'formList',
              dataIndex: 'linkAttrs',
              initialValue: [{ name: '可选值' }],
              fieldProps: {
                creatorRecord: { name: '可选值' },
                max: 6,
              },
              colProps: {
                span: 24,
              },
              columns: [
                {
                  valueType: 'group',
                  colProps: {
                    span: 24,
                  },
                  columns: [
                    {
                      title: '属性编号',
                      dataIndex: 'id',
                      valueType: 'select',
                      colProps: {
                        span: 9,
                      },
                      fieldProps: {
                        fieldNames: { label: 'name', value: 'id' },
                        options: attrs,
                      },
                      formItemProps: {
                        rules: [{ required: true, message: '属性编号为必填项' }],
                      },
                    },
                    {
                      valueType: 'dependency',
                      name: ['id'],
                      columns: ({ id }) => {
                        return [
                          {
                            title: '属性名',
                            dataIndex: 'attrName',
                            colProps: { span: 9 },
                            tooltip: '公式中用于匹配关键字',
                            renderFormItem() {
                              const _target = attrs?.find((v) => v.id === id);
                              return (
                                <Input
                                  name="attrName"
                                  readOnly
                                  title={id}
                                  value={_target?.name + '/' + _target?.id}
                                />
                              );
                            },
                          },
                        ];
                      },
                    },
                    {
                      title: '值',
                      dataIndex: 'value',
                      colProps: { span: 6 },
                      readonly: trigger !== 'Start',
                    },
                  ],
                },
              ],
            },
          ]
        : [
            {
              title: '通用模板',
              dataIndex: 'templateId',
              valueType: 'select',
              fieldProps: {
                options: sysRules.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                }),
              },
              formItemProps: {
                rules: [{ required: true, message: '通用模板为必选项' }],
              },
            },
            {
              valueType: 'dependency',
              name: ['templateId', 'trigger'],
              columns: ({ templateId, trigger }) => {
                const def = { accept: undefined, isExtend: false };
                const _selectedRule = sysRules.find((v) => v.id == templateId);
                const { attrs: items = [], isExtend = false } = {
                  ...def,
                  ..._selectedRule,
                };
                const maxlength = isExtend ? 20 : items.length || 2;

                return [
                  {
                    title: '错误提示词',
                    dataIndex: 'errMsg',
                    tooltip: '规则验证失败时，展示的提示内容',
                    colProps: { span: 24 },
                  },
                  {
                    title: '规则描述',
                    dataIndex: 'remark',
                    colProps: { span: 24 },
                  },
                  {
                    title: '关联表单属性',
                    valueType: 'formList',
                    dataIndex: 'linkAttrs',
                    fieldProps: {
                      creatorRecord: { name: '可选值' },
                      max: maxlength,
                    },
                    colProps: {
                      span: 24,
                    },
                    columns: [
                      {
                        valueType: 'group',
                        colProps: {
                          span: 24,
                        },
                        columns: [
                          {
                            title: '属性名称',
                            dataIndex: 'id',
                            valueType: 'select',
                            colProps: {
                              span: 9,
                            },
                            fieldProps: {
                              fieldNames: { label: 'name', value: 'id' },
                              // options: accept
                              //   ? attrs?.filter((s) =>
                              //       accept?.includes(s.property!.valueType),
                              //     )
                              //   : attrs,
                              options: attrs,
                            },
                            formItemProps: {
                              rules: [{ required: true, message: '属性名称为必选项' }],
                            },
                          },
                          {
                            valueType: 'dependency',
                            name: ['id'],
                            columns: ({ id }) => {
                              return [
                                {
                                  title: '属性名',
                                  tooltip: '公式中用于匹配关键字',
                                  dataIndex: 'attrName',
                                  colProps: { span: 9 },
                                  // readonly: true,
                                  renderFormItem(_schema, _config, form, _action) {
                                    form.setFieldValue(
                                      'attrName',
                                      attrs?.find((v) => v.id === id)?.name,
                                    );
                                    return (
                                      <Input
                                        name="attrName"
                                        readOnly
                                        value={attrs.find((v) => v.id === id)?.name}
                                      />
                                    );
                                  },
                                },
                              ];
                            },
                          },
                          {
                            title: '值',
                            dataIndex: 'value',
                            colProps: { span: 6 },
                            readonly: trigger !== 'Start',
                          },
                        ],
                      },
                    ],
                  },
                ];
              },
            },
          ];
    },
  },
];

export { getColumns };
