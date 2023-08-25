// import { Col, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import Generator, { defaultSettings } from 'fr-generator';
import { schemaType } from '@/ts/base/schema';
import getDefaultCommonSettings from './setting.js';
import MyDivider from './widgets/Divider';
import MySpace from './widgets/Space';
import ProFormPerson from './widgets/ProFormPerson';
import { Setting, SettingWidget } from '@/ts/core/work/design';
import FormDesign from '@/components/Common/FormDesign';
import Attribute from '@/executor/config/operateModal/labelsModal/Attritube';
import FormRules from '@/executor/config/operateModal/labelsModal/formRules';
import { XAttribute } from '@/ts/base/schema';
import globalSettings from './globalSettings';
import RuleComp from './widgets/RuleComp';
const { Provider, Sidebar, Canvas, Settings } = Generator;
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
  const [modalType, setModalType] = useState<string>('');
  const [tabKey, setTabKey] = useState<string>('attr');
  console.log('@@@',current, current.fields, commonSettings);

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
    console.log(1, getDefaultCommonSettings(e));
    const a = getDefaultCommonSettings(e);
    console.log(2, copyObj(a));
    setCommonSettings(copyObj(a));
    const schema = myComponentRef.current.getValue();
    console.log(3, schema);
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
  console.log('@@', defaultSettings, setting, commonSettings);
  const add = (e: any) => {
    console.log(e);
    setModalType('新增特性');
  };
  const content = () => {
    if (tabKey === 'attr') {
      return (
        <Attribute
          current={current}
          modalType={modalType}
          recursionOrg={true}
          setModalType={setModalType}
        />
      );
    }
    if (tabKey === 'rule') {
      return (
        <FormRules
          current={current}
          setModalType={setModalType}
          modalType={modalType}
          recursionOrg={false}
        />
      );
    }
  };
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
      {/* <Generator
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
      /> */}
      <div className={cls.frplayground}>
        <Provider
          defaultValue={defaultSchema}
          onChange={(data) => console.log('data:change', data)}
          onSchemaChange={onFormSchemaChange}
          settings={setting}
          globalSettings={globalSettings}
          extraButtons={[
            true,
            false,
            false,
            true,
            {
              /** 按钮文案 */
              text: '新增特性',
              /** 点击回调 */
              onClick: (event: any) => {
                add(event);
              },
              key: 'add',
            },
          ]}
          canDelete={onClickDelete}
          hideId
          widgets={{ MyDivider, MySpace, ProFormPerson, RuleComp }}
          settingsWidgets={{ RuleComp }}
          commonSettings={commonSettings}
          ref={myComponentRef}>
          <div className="fr-generator-container">
            <div style={{ width: '20%' }}>
              <Sidebar fixedName />
            </div>
            <div style={{ width: '50%' }}>
              <Canvas onCanvasSelect={onCanvasSelect} />
            </div>
            <div style={{ width: '30%' }}>
              <Settings />
              {/* <RuleComp form={current} /> */}
            </div>
          </div>
        </Provider>
      </div>
      {/* <div className={cls['page-content-table']}>{content()}</div> */}
    </FullScreenModal>
  );
};

export default FormEditModal;
