// import { Col, Row, Select } from 'antd';
import React, { useRef } from 'react';
// import cls from './index.module.less';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import Generator, { defaultSettings } from 'fr-generator';
import { ProFormMoney } from '@ant-design/pro-components';
import { schemaType } from '@/ts/base/schema';
import { defaultCommonSettings } from './setting.js';
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
  const myComponentRef = useRef(null);

  const onSchemaChange = (e: schemaType) => {
    const ruleInfo = JSON.parse(current.metadata.rule || '{}');
    current.update({
      ...current.metadata,
      rule: JSON.stringify({
        ...ruleInfo,
        schema: e,
      }),
    });
  };
  //const onCanvasSelect = (e: any) => {};

  //页面重载获取默认schema或者配置后的schema
  const settings = defaultSettings[0];
  settings.widgets = [
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
        onSchemaChange={onSchemaChange}
        settings={[defaultSettings[2], settings]}
        //onCanvasSelect={onCanvasSelect}
        widgets={{ money: ProFormMoney }}
        commonSettings={{ ...defaultCommonSettings }}
        ref={myComponentRef}
      />
    </FullScreenModal>
  );
};

export default FormEditModal;
