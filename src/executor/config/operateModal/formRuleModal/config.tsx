import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';

import CodeEdit from '@/components/ReactCodeEdit';
import { XAttribute, XFormRule } from '@/ts/base/schema';

/** 规则运行类型 */
export const trigger: { [key: string]: string } = {
  Start: '初始化', //首次加载表单时触发
  Running: '运行时', //依赖项变更时触发
  Submit: '提交时', //表单提交时触发
};
export const FormRuleType: { [key: string]: string } = {
  formula: '公式', //计算相关
  method: '函数体', //依赖项变更时触发
  other: '校验规则', //表单提交时触发
};
const getColumns: (
  attrs: XAttribute[],
  sysRules?: any[],
) => ProFormColumnsType<XFormRule>[] = (attrs, sysRules = []) => [
  {
    title: '规则编号',
    dataIndex: 'code',
    formItemProps: {
      rules: [{ required: true, message: '规则代码为必填项' }],
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
      rules: [{ required: true, message: '规则代码为必填项' }],
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
    valueType: 'dependency',
    name: ['modalType'],
    columns: ({ modalType }) => {
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
                rules: [{ required: true, message: '是否公开为必填项' }],
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
                            defaultVal={_config}
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
              initialValue: [{ val: '值1' }],
              fieldProps: {
                creatorRecord: { val: '值' },
                max: 6,
              },
              colProps: {
                span: 24,
              },
              columns: [
                {
                  valueType: 'group',
                  tooltip: '属性第一项 为默认规则操作目标',
                  colProps: {
                    span: 24,
                  },
                  columns: [
                    {
                      title: '值集',
                      dataIndex: 'val',
                      readonly: true,
                      colProps: { span: 4 },
                    },
                    {
                      title: '属性名称',
                      dataIndex: 'attrId',
                      valueType: 'select',
                      colProps: {
                        span: 8,
                      },
                      fieldProps: {
                        fieldNames: { label: 'name', value: 'id' },
                        options: attrs,
                      },
                      formItemProps: {
                        rules: [{ required: true, message: '规则定义为必填项' }],
                      },
                    },
                    // {
                    //   valueType: 'dependency',
                    //   name: ['linkAttrs'],
                    //   columns: ({ attrId }) => {
                    //     return [
                    //       {
                    //         title: '属性编码',
                    //         dataIndex: 'attrCode',
                    //         colProps: { span: 8 },
                    //         // readonly: true,
                    //         renderFormItem() {
                    //           return (
                    //             <span>{attrs.find((v) => v.id === attrId)?.id}</span>
                    //           );
                    //         },
                    //       },
                    //     ];
                    //   },
                    // },
                    {
                      title: '展示数据',
                      dataIndex: 'value',
                      colProps: { span: 4 },
                      // readonly: trigger !== 'Start',
                    },
                  ],
                },
              ],
            },
          ]
        : [
            {
              title: '通用模板',
              dataIndex: 'commonTemp',
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
                rules: [{ required: true, message: '是否公开为必填项' }],
              },
            },
            {
              valueType: 'dependency',
              name: ['commonTemp', 'trigger'],
              columns: ({ commonTemp, trigger }) => {
                const def = { accept: undefined, isExtend: false };
                const _selectedRule = sysRules.find((v) => v.id == commonTemp);
                const {
                  accept = [],
                  attrs: items = [],
                  isExtend = false,
                } = { ...def, ..._selectedRule };
                const maxlength = isExtend ? 20 : items.length || 2;
                console.log('maxlength', maxlength);

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
                      creatorRecord: { val: '值1' },
                      max: maxlength,
                    },
                    colProps: {
                      span: 24,
                    },
                    columns: [
                      {
                        valueType: 'group',
                        tooltip: '属性第一项 为默认规则操作目标',
                        colProps: {
                          span: 24,
                        },
                        columns: [
                          {
                            title: '值集',
                            dataIndex: 'val',
                            readonly: true,
                            colProps: { span: 4 },
                          },
                          {
                            title: '属性名称',
                            dataIndex: 'id',
                            valueType: 'select',
                            colProps: {
                              span: 8,
                            },
                            fieldProps: {
                              fieldNames: { label: 'name', value: 'id' },
                              options: accept
                                ? attrs.filter((s) =>
                                    accept?.includes(s.property!.valueType),
                                  )
                                : attrs,
                              // options: attrs,
                            },
                            formItemProps: {
                              rules: [{ required: true, message: '规则定义为必填项' }],
                            },
                          },
                          // {
                          //   valueType: 'dependency',
                          //   name: ['attrId'],
                          //   columns: ({ attrId }) => {
                          //     return [
                          //       {
                          //         title: '属性编码',
                          //         dataIndex: 'attrCode',
                          //         colProps: { span: 8 },
                          //         // readonly: true,
                          //         renderFormItem() {
                          //           return (
                          //             <span>
                          //               {attrs.find((v) => v.id === attrId)?.id}
                          //             </span>
                          //           );
                          //         },
                          //       },
                          //     ];
                          //   },
                          // },
                          {
                            title: '展示数据',
                            dataIndex: 'value',
                            colProps: { span: 8 },
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
