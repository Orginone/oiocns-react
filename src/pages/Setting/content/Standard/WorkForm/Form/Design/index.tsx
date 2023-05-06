import { XForm } from '@/ts/base/schema';
import { ITarget } from '@/ts/core';
import { Button, Card, message } from 'antd';
import React, { useState } from 'react';
import { ImUndo2 } from 'react-icons/im';
import { SaveOutlined } from '@ant-design/icons';
import { FormModel } from '@/ts/base/model';
import Design from './design';
import { IWorkForm } from '@/ts/core/thing/app/work/workform';

interface Iprops {
  target?: ITarget;
  current: IWorkForm;
  form: XForm;
  onBack: () => void;
}

/*
  表单设计
*/
const SpeciesFormDesign: React.FC<Iprops> = (props: Iprops) => {
  const { current, form, onBack } = props;
  const [formModel, setFormModel] = useState<FormModel>();

  const save = async () => {
    if (formModel) {
      if (await current.updateForm(formModel)) {
        message.success('保存成功！');
      }
    }
  };

  return (
    <Card
      title={form?.name}
      extra={
        <>
          <Button
            onClick={save}
            type="primary"
            icon={<SaveOutlined />}
            disabled={!formModel}>
            保存
          </Button>
          <Button
            key="back"
            type="link"
            onClick={() => {
              onBack();
            }}>
            <div style={{ display: 'flex' }}>
              <div style={{ paddingTop: '2px' }}>
                <ImUndo2 />
              </div>
              <div style={{ paddingLeft: '6px' }}>返回</div>
            </div>
          </Button>
        </>
      }>
      <Design form={form} current={current as IWorkForm} setFormModel={setFormModel} />
    </Card>
  );
};

export default SpeciesFormDesign;
