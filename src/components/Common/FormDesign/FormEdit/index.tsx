// import { Col, Row, Select } from 'antd';
import React, { useRef } from 'react';
// import cls from './index.module.less';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import Generator, { defaultSettings } from 'fr-generator';
import { schemaType } from '@/ts/base/schema';
import { defaultCommonSettings } from './setting.js';
import MyDivider from '@/components/Common/FormDesign/FormEdit/widgets/Divider';
import MySpace from '@/components/Common/FormDesign/FormEdit/widgets/Space';

type IProps = {
  current: IForm;
  finished: () => void;
  editFormOpen: boolean;
  defaultSchema: schemaType;
  itemClick: (e: any) => void;
};

/**
 * 表单设计器
 * @param props
 */
const FormEditModal: React.FC<IProps> = ({
  current,
  finished,
  defaultSchema,
  editFormOpen = false,
}) => {
  // 创建ref
  const myComponentRef: any = useRef(null);
  // const onCloseFormModle = () => {
  //   onFormSchemaChange(myComponentRef.current.getValue());
  //   finished();
  // };
  const onFormSchemaChange = (e: schemaType) => {
    const ruleInfo = JSON.parse(current.metadata.rule || '{}');
    current.update({
      ...current.metadata,
      rule: JSON.stringify({
        ...ruleInfo,
        schema: e,
      }),
    });
  };

  //页面重载获取默认schema或者配置后的schema
  const settings = defaultSettings[0];
  settings.widgets = [
    {
      text: '评分',
      name: 'rate',
      schema: {
        title: '评分',
        type: 'string',
        widget: 'rate',
      },
      setting: {
        props: {
          type: 'string',
          properties: {
            value: {
              title: '评分',
              type: 'string',
            },
          },
        },
      },
    },
    {
      text: 'HTML',
      name: 'html',
      schema: {
        title: 'HTML',
        type: 'string',
        widget: 'html',
      },
      setting: {
        props: {
          type: 'object',
          properties: {
            value: {
              title: '展示内容',
              type: 'string',
            },
          },
        },
      },
    },
    {
      text: '分割线',
      name: 'divider',
      schema: {
        title: '分割线',
        type: 'string',
        widget: 'MyDivider',
      },
      setting: {
        children: { title: '嵌套的标题', type: 'string' },
        dashed: { title: '是否虚线', type: 'boolean' },
      },
    },
    {
      text: '间距',
      name: 'space',
      schema: {
        title: '分割线',
        type: 'string',
        widget: 'MySpace',
      },
      setting: {
        api: { title: 'MySpace', type: 'string' },
      },
    },
  ];
  return (
    <FullScreenModal
      open={editFormOpen}
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={'表单设计'}
      footer={[]}
      onCancel={finished}>
      <Generator
        defaultValue={defaultSchema}
        onSchemaChange={onFormSchemaChange}
        settings={[defaultSettings[2], settings]}
        extraButtons={[true, false, false, false]}
        canDelete={false}
        hideId
        widgets={{ MyDivider, MySpace }}
        commonSettings={{ ...defaultCommonSettings }}
        ref={myComponentRef}
      />
    </FullScreenModal>
  );
};

export default FormEditModal;
