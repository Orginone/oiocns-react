import React, { useRef, useState } from 'react';
import Generator, { defaultSettings } from 'fr-generator';
import cls from './index.module.less';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IForm } from '@/ts/core';
import MyDivider from './widgets/Divider';
import MySpace from './widgets/Space';
import ProFormPerson from './widgets/ProFormPerson';
import { schemaType } from '@/ts/base/schema';
import PageSetting from './Settings';
import { Resizable } from 'devextreme-react';
import AttrModal from '@/executor/config/operateModal/labelsModal/Attritube/attrModal';

const { Provider, Sidebar, Canvas } = Generator;

type IProps = {
  current: IForm;
  updateSchema: () => void;
  getCurFormSchema: () => Promise<schemaType>;
  setIsOpen: (ble: boolean) => void;
  isOpen: boolean;
  formSchema: schemaType;
};

/**
 * 表单设计器
 * @param props
 */
const FormEditModal: React.FC<IProps> = ({
  current,
  updateSchema,
  getCurFormSchema,
  formSchema,
  isOpen = false,
  setIsOpen,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [mainWidth, setMainWidth] = useState<string | number>('40%');
  // console.log('@@@', current, current.fields, commonSettings);

  // 创建ref
  const myComponentRef: any = useRef(null);
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
    const id = e?.$id?.replace('#/', '');
    const attr = current.attributes.find((item) => item.id === id);
    // 删除的是特性组件
    if (attr) {
      const sucDelAttr = await current.deleteAttribute(attr);
      sucDelAttr && current.loadFields(true);
      return sucDelAttr;
    } else {
      // 删除的是布局类等非特性组件，需要删除其内部的包裹特性
      const schema: schemaType = await getCurFormSchema();
      const matchProperty: { properties: Record<string, any> } = schema?.properties?.[
        id
      ] as any;
      // 假如非特性类组件包裹特性组件，则需要遍历删除（目前只做了一层，后续根据实际业务需要，考虑递归多层）
      if (matchProperty?.properties) {
        const toDelAttrIds = Object.keys(matchProperty?.properties).filter(
          (subId) => !isNaN(+subId),
        );
        const toDelAttrs = current.attributes.filter((item) =>
          toDelAttrIds.includes(item.id),
        );
        const toDelAttrFns: Promise<boolean>[] = toDelAttrs.reduce((pre, cur) => {
          pre.push(current.deleteAttribute(cur));
          return pre;
        }, [] as Promise<boolean>[]);
        // console.log('toDelAttrs', toDelAttrs);
        // console.log('toDelAttrFns', toDelAttrFns);
        if (toDelAttrFns.length) await Promise.all(toDelAttrFns);
      }
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
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  /**
   * FormEdit表单完成监听
   */
  const onFinished = () => {
    updateSchema();
    setIsOpen(false);
  };

  return (
    <FullScreenModal
      open={isOpen}
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={'表单设计'}
      footer={[]}
      onCancel={onFinished}>
      <div className={cls.frplayground}>
        {/*@ts-ignore*/}
        <Provider
          defaultValue={formSchema}
          onSchemaChange={onFormSchemaChange}
          allCollapsed={false}
          extraButtons={[
            true,
            false,
            false,
            true,
            {
              /** 按钮文案 */
              text: '新增特性',
              /** 点击回调 */
              onClick: () => setIsAttrModalOpen(true),
              key: 'add',
            },
          ]}
          canDelete={onClickDelete}
          controlButtons={[true, false]}
          widgets={{ MyDivider, MySpace, ProFormPerson, person: ProFormPerson }}
          settings={setting}
          commonSettings={{}}
          ref={myComponentRef}
          onCanvasSelect={(v) => console.log(v)}
          fieldWrapperRender={(schema, isSelected, _children, originNode) => {
            if (isSelected && selectedItem.title !== schema.title) {
              /* 收集当前选中项 */
              setSelectedItem(schema);
            }
            return originNode;
          }}>
          <div className="fr-generator-container">
            <div style={{ width: '280px' }}>
              <Sidebar fixedName />
            </div>
            <Resizable
              handles={'right'}
              width={mainWidth}
              onResize={(e) => {
                setMainWidth(e.width);
              }}>
              <Canvas />
            </Resizable>
            <PageSetting
              current={current}
              selectedFiled={selectedItem}
              schemaRef={myComponentRef}
              canvasWidth={mainWidth as number}
              // comp={<Settings />}
            />
          </div>
        </Provider>
      </div>
      {/*特性编辑表单*/}
      <AttrModal
        current={current}
        updateSchema={updateSchema}
        isOpen={isAttrModalOpen}
        setIsOpen={setIsAttrModalOpen}
      />
    </FullScreenModal>
  );
};

export default FormEditModal;
