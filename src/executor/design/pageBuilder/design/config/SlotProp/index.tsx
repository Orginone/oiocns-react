import { Input } from 'antd';
import React, { useContext, useState } from 'react';
import { PageElement } from '../../../core/PageElement';
import AddElementModal from '../../AddElementModal';
import { DesignContext, PageContext } from '../../../render/PageContext';
import { IExistTypeProps } from '../IExistTypeEditor';

const SlotProp: React.FC<IExistTypeProps<PageElement>> = ({ value, prop }) => {
  const ctx = useContext(PageContext) as DesignContext;
  const [center, setCenter] = useState(<></>);
  return (
    <>
      <Input
        value={value?.name}
        onClick={() => {
          setCenter(
            <AddElementModal
              parentId={ctx.view.currentElement?.id!}
              prop={prop}
              onFinished={() => setCenter(<></>)}
            />,
          );
        }}
      />
      {center}
    </>
  );
};

export default SlotProp;
