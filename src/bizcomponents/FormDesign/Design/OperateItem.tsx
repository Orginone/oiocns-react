import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import OioFormItem from './OioForm/FormItems';
import { IBelong } from '@/ts/core';
import { XFormItem } from '@/ts/base/schema';

interface IProps {
  belong: IBelong;
  item: XFormItem;
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
    <>
      {/* {props.item.belongId !== props.belong.metadata.id ? (
        <div style={{ cursor: 'no-drop' }}>
          {<OioFormItem item={props.item} belong={props.belong} />}
        </div>
      ) : ( */}
      <div style={styles} ref={setNodeRef} {...listeners} onClick={props.cl}>
        {<OioFormItem item={props.item} belong={props.belong} />}
      </div>
      {/* )} */}
    </>
  );
};

export default OperateItem;
