import React, { useState } from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { Form } from 'devextreme-react';
import { FormSetting, GroupSetting, ItemSetting } from './Setting';
import { IForm } from '@/ts/core';
import { schema } from '@/ts/base';
import { GroupItem, Item, SimpleItem } from 'devextreme-react/form';

type IProps = {
  form: IForm;
  finished: () => void;
};

const FormDesign: React.FC<IProps> = ({ form, finished }: IProps) => {
  const [metadata, setMetadata] = useState<schema.XForm>(form.metadata);
  const loadContent = () => {
    return <Form colCount={metadata.setting.colCount}>{loadItem(metadata.items)}</Form>;
  };
  const loadSetting = () => {
    var str = '';
    switch (str) {
      case 'Item':
        return <ItemSetting></ItemSetting>;
      case 'Group':
        return <GroupSetting></GroupSetting>;
      default:
        return <FormSetting current={metadata}></FormSetting>;
    }
  };
  const addButtonOptions = (a: schema.XFormItem) => {
    return {
      icon: 'add',
      text: '新增',
      onClick: () => {
        //TODO:新增项弹窗
        console.log(a);
      },
    };
  };

  const loadItem = (items: schema.XFormItem[]) => {
    return items.map((a) => {
      switch (a.typeName) {
        case '输入框':
        case '分组':
          return (
            <GroupItem caption={a.name}>
              {a.children ? loadItem(a.children) : <></>}
              <SimpleItem
                itemType="button"
                cssClass="add-phone-button"
                // buttonOptions={addButtonOptions(a)}
              />
            </GroupItem>
          );
        default:
          if (a.attribute) {
            return <Item dataField="FirstName" />;
          }
      }
    });
  };

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={'表单设计'}
      footer={[]}
      onSave={() => form.update(metadata)}
      onCancel={finished}>
      <>
        {loadContent()}
        {loadSetting()}
      </>
    </FullScreenModal>
  );
};

export default FormDesign;
