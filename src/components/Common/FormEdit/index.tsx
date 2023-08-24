// import { Col, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// import cls from './index.module.less';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import Generator, { defaultSettings } from 'fr-generator';
import { schemaType } from '@/ts/base/schema';
import getDefaultCommonSettings from './setting.js';
import MyDivider from './widgets/Divider';
import MySpace from './widgets/Space';
import ProFormPerson from './widgets/ProFormPerson';
import { Setting, SettingWidget } from '@/ts/core/work/design';
type IProps = {
  current: IForm;
  finished: () => void;
  editFormOpen: boolean;
  defaultSchema: schemaType;
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
  const [commonSettings, setCommonSettings] = useState<any>({});
  // 创建ref
  const myComponentRef: any = useRef(null);
  const onCloseFormModle = () => {
    onFormSchemaChange(myComponentRef.current.getValue());
    finished();
  };
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

  const onClickDelete = (e: any) => {
    return false;
  };
  const copyObj = (obj = {}) => {
    //变量先置空
    let newobj = null;

    //判断是否需要继续进行递归
    if (typeof obj == 'object' && obj !== null) {
      newobj = obj instanceof Array ? [] : {}; //进行下一层递归克隆
      for (var i in obj) {
        newobj[i] = copyObj(obj[i]);
      } //如果不是对象直接赋值
    } else newobj = obj;
    return newobj;
  };
  const onCanvasSelect = async (e: any) => {
    console.log(getDefaultCommonSettings(e));
    const a = getDefaultCommonSettings(e);
    console.log(copyObj(a));
    setCommonSettings(copyObj(a));
    const schema = myComponentRef.current.getValue();
    console.log(schema);
    //myComponentRef.current.setValue(schema)
  };

  // useEffect(() => {

  //   debugger;
  // }, []);
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
      text: '人员',
      name: 'ProFormPerson',
      schema: {
        title: '人员',
        type: 'string',
        widget: 'ProFormPerson',
        metadata: current.metadata,
      },
      setting: {
        // children: { title: '嵌套的标题', type: 'string' },
        // dashed: { title: '是否虚线', type: 'boolean' },
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
  console.log('@@', setting);
  // setting.map((item) => {
  //   item.widgets.map((widgetsItem: SettingWidget) => {
  //     return (widgetsItem.setting = {
  //       ...widgetsItem.setting,
  //       ...getDefaultCommonSettings(widgetsItem.schema.type),
  //     });
  //   });
  // });
  return (
    <FullScreenModal
      open={editFormOpen}
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={'表单设计'}
      footer={[]}
      onCancel={finished}
    >
      <Generator
        defaultValue={defaultSchema}
        onSchemaChange={onFormSchemaChange}
        onCanvasSelect={onCanvasSelect}
        settings={setting}
        extraButtons={[true, false, false, true]}
        canDelete={onClickDelete}
        hideId
        widgets={{ MyDivider, MySpace, ProFormPerson }}
        commonSettings={commonSettings}
        ref={myComponentRef}
      />
    </FullScreenModal>
  );
};

export default FormEditModal;
