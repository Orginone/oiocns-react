// import { Col, Row, Select } from 'antd';
import React, { useRef, useState, useImperativeHandle } from 'react';
import type { MutableRefObject } from 'react';
import cls from './index.module.less';
import { IForm } from '@/ts/core';
import Generator, { defaultSettings } from 'fr-generator';
import { schemaType } from '@/ts/base/schema';
import getDefaultCommonSettings from './setting.js';
import MyDivider from './widgets/Divider';
import MySpace from './widgets/Space';
import ProFormPerson from './widgets/ProFormPerson';
import Attribute from '@/executor/config/operateModal/labelsModal/Attritube';
import { XAttribute } from '@/ts/base/schema';
const { Provider, Sidebar, Canvas, Settings } = Generator;
type IProps = {
  current: IForm;
  finished: () => void;
  editFormOpen: boolean;
  defaultSchema: schemaType;
  onSave?: MutableRefObject<onSave>;
};
export type onSave = { saveSchema: () => void };

/**
 * 表单设计器
 * @param props
 */
const FormEditModal: React.FC<IProps> = ({
  current,
  finished,
  defaultSchema,
  editFormOpen = false,
  onSave,
}) => {
  const [modalType, setModalType] = useState<string>('');
  // 创建ref
  const myComponentRef: any = useRef(null);
  useImperativeHandle(onSave, () => ({
    saveSchema: () => {
      onFormSchemaChange(myComponentRef.current.getValue());
    },
  }));
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
  const onClickDelete = async (e: any) => {
    const item: any = current.attributes
      .map((item: XAttribute) => {
        if (item.id === e.$id.replace('#/', '')) {
          return item;
        }
      })
      .filter((itemFl: any) => {
        return itemFl && itemFl.id;
      });
    if (await current.deleteAttribute(item[0])) {
      return true;
    }
  };
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
        title: '',
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
        title: '',
        type: 'string',
        widget: 'MySpace',
      },
      setting: {
        api: { title: 'MySpace', type: 'string' },
      },
    },
  ];
  const setting = [defaultSettings[2], settings];
  const add = () => {
    setModalType('新增特性');
  };
  const content = () => {
    return (
      <Attribute
        current={current}
        modalType={modalType}
        recursionOrg={true}
        setModalType={setModalType}
      />
    );
  };
  return (
    <>
      <div className={cls.frplayground}>
        <>
          <Provider
            defaultValue={defaultSchema}
            onChange={(data) => console.log('data:change', data)}
            onSchemaChange={onFormSchemaChange}
            settings={setting}
            extraButtons={[
              true,
              false,
              false,
              true,
              {
                /** 按钮文案 */
                text: '新增特性',
                type: 'primary',
                /** 点击回调 */
                onClick: () => {
                  add();
                },
                key: 'add',
              },
            ]}
            canDelete={onClickDelete}
            hideId
            widgets={{ MyDivider, MySpace, ProFormPerson }}
            commonSettings={getDefaultCommonSettings('')}
            ref={myComponentRef}>
            <div className="fr-generator-container">
              <div style={{ width: '20%' }}>
                <Sidebar fixedName />
              </div>
              <div style={{ width: '50%' }}>
                <Canvas
                // onCanvasSelect={onCanvasSelect}
                />
              </div>
              <div style={{ width: '30%' }}>
                <Settings />
              </div>
            </div>
          </Provider>
        </>
      </div>
      <div className={cls['page-content-table']}>{content()}</div>
    </>
  );
};

export default FormEditModal;
