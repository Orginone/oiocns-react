import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import userCtrl from '@/ts/controller/setting';

const OperateItem = (props: any) => {
  const belongId = userCtrl.space.id;
  const { item } = props;
  const { setNodeRef, listeners, transform } = useSortable({ id: item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    cursor: 'move',
  };
  const renderItem = (item: any) => {
    const rule = JSON.parse(item.rule);
    switch (rule.widget) {
      case 'input':
      case 'string':
      case 'text':
        return (
          <ProFormText
            name={item.code}
            label={rule.title}
            fieldProps={rule}
            rules={rule.rules}
            tooltip={rule.description}
            labelAlign="right"
          />
        );
      case 'digit':
      case 'number':
        return (
          <ProFormDigit
            name={item.code}
            label={rule.title}
            fieldProps={rule}
            rules={rule.rules}
            tooltip={rule.description}
            labelAlign="right"
          />
        );
      case 'select':
        return (
          <ProFormSelect
            name={item.code}
            label={rule.title}
            fieldProps={rule}
            rules={rule.rules}
            tooltip={rule.description}
            labelAlign="right"
          />
        );
      case 'dict':
        return (
          <ProFormSelect
            name={item.code}
            label={rule.title}
            fieldProps={rule}
            rules={rule.rules}
            tooltip={rule.description}
            labelAlign="right"
          />
        );
      case 'file':
      case 'upload':
        return (
          <ProFormUploadButton
            name={item.code}
            label={rule.title}
            fieldProps={rule}
            rules={rule.rules}
            tooltip={rule.description}
            labelAlign="right"
          />
        );
      default:
        return (
          <ProFormText
            name={item.code}
            label={rule.title}
            fieldProps={rule}
            rules={rule.rules}
            tooltip={rule.description}
            labelAlign="right"
          />
        );
    }
  };

  return (
    <>
      {item.belongId !== belongId && renderItem(item)}
      {item.belongId == belongId && (
        <div style={styles} ref={setNodeRef} {...listeners}>
          {renderItem(item)}
        </div>
      )}
    </>
  );
};

export default OperateItem;
