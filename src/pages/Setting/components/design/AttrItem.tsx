import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Tooltip, Typography } from 'antd';
import React from 'react';

/**
 * 特性
 */
const AttrItem = (props: any) => {
  const { item } = props;
  const { setNodeRef, listeners, transform } = useSortable({ id: item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    marginTop: '4px',
  };
  return (
    <div ref={setNodeRef} {...listeners} style={styles}>
      <Tooltip title={item.name} mouseLeaveDelay={0} mouseEnterDelay={0.8}>
        <Button block style={{ cursor: 'move' }}>
          <Typography.Paragraph ellipsis={true}>{item.name}</Typography.Paragraph>
        </Button>
      </Tooltip>
    </div>
  );
};

export default AttrItem;
