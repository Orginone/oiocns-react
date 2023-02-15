import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox } from 'antd';
import React from 'react';

const AttrItem = (props: any) => {
  const { item, checkAttr } = props;
  const { setNodeRef, listeners, transform } = useSortable({ id: item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    marginTop: '4px',
  };
  const change = (e: any) => {
    checkAttr(e.target.checked, e.target.value);
  };
  return (
    <div ref={setNodeRef} {...listeners} style={styles}>
      <Checkbox onChange={change} value={item}>
        <Button block>{item.name}</Button>
      </Checkbox>
    </div>
  );
};

export default AttrItem;
