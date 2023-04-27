import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import OioFormItem from './OioForm/FormItems';
import { ISpace } from '@/ts/core';

interface IProps {
  space: ISpace;
  [key: string]: any;
}

const OperateItem = (props: IProps) => {
  const belongId = props.space.id;
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
          {<OioFormItem item={item} space={props.space} />}
        </div>
      )}
      {item.belongId == belongId && (
        <div style={styles} ref={setNodeRef} {...listeners}>
          {<OioFormItem item={item} space={props.space} />}
        </div>
      )}
    </>
  );
};

export default OperateItem;
