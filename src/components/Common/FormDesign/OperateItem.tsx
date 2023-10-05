import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import OioFormItem from './OioForm/FormItems';
import { IBelong } from '@/ts/core';
import { XAttribute } from '@/ts/base/schema';

interface IProps {
  belong: IBelong;
  item: XAttribute;
  onClick: Function;
  [key: string]: any;
}

const OperateItem = (props: IProps) => {
  const { setNodeRef, listeners, transform } = useSortable({ id: props.item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    cursor: 'move',
  };

  return (
    <div style={styles} ref={setNodeRef} {...listeners}>
      <OioFormItem
        item={props.item}
        belong={props.belong}
        onClick={() => props.onClick()}
      />
    </div>
  );
};

export default OperateItem;
