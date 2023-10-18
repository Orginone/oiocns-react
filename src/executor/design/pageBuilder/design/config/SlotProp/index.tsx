import { Input } from 'antd';
import React, { useContext, useState } from 'react';
import { PageElement } from '../../../core/PageElement';
import AddElementModal from '../../AddElementModal';
import { DesignContext, PageContext } from '../../../render/PageContext';
import { IExistTypeProps } from '../IExistTypeEditor';

const SlotProp: React.FC<IExistTypeProps<PageElement>> = ({ value, prop }) => {
  console.log('slot', value, prop);
  const ctx = useContext(PageContext) as DesignContext;
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Input value={value?.name} onClick={() => setVisible(true)} />
      <AddElementModal
        visible={visible}
        parentId={ctx.view.currentElement?.id!}
        onVisibleChange={(v) => setVisible(v)}
        prop={prop}
      />
    </>
  );
};

export default SlotProp;
