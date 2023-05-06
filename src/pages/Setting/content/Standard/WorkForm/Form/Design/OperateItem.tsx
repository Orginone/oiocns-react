import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import OioFormItem from './OioForm/FormItems';
import { IBelong } from '@/ts/core';

interface IProps {
  belong: IBelong;
  [key: string]: any;
}

const OperateItem = (props: IProps) => {
  const belongId = props.belong.metadata.id;
  const { item } = props;
  const { setNodeRef, listeners, transform } = useSortable({ id: item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    cursor: 'move',
  };

  return (
    <>
      {item.belongId !== belongId && (
        <div style={{ cursor: 'no-drop' }}>
          {<OioFormItem item={item} belong={props.belong} />}
        </div>
      )}
      {item.belongId == belongId && (
        <div style={styles} ref={setNodeRef} {...listeners}>
          {<OioFormItem item={item} belong={props.belong} />}
        </div>
      )}
    </>
  );
};

export default OperateItem;
