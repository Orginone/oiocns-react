import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import userCtrl from '@/ts/controller/setting';
import OioFormItem from '../../../../components/FromItem/FormItems';

const OperateItem = (props: any) => {
  const belongId = userCtrl.space.id;
  const { item } = props;
  const { setNodeRef, listeners, transform } = useSortable({ id: item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    cursor: 'move',
  };

  return (
    <>
      {item.belongId !== belongId && (
        <div style={{ cursor: 'no-drop' }}>{<OioFormItem item={item} />}</div>
      )}
      {item.belongId == belongId && (
        <div style={styles} ref={setNodeRef} {...listeners}>
          {<OioFormItem item={item} />}
        </div>
      )}
    </>
  );
};

export default OperateItem;
