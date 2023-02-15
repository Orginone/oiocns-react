import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useState } from 'react';
import { ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { kernel } from '@/ts/base';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';
import { EditableProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * 子表
 */
const SpeciesTable = (props: any) => {
  const { item } = props;
  const [columns, setColumns] = useState<any[]>([]);
  useEffect(() => {
    const loadAttrs = async () => {
      const res = await kernel.querySpeciesAttrs({
        id: item.id,
        spaceId: userCtrl.space.id,
        page: {
          offset: 0,
          limit: 10000,
          filter: '',
        },
      });
      const attrs = res.data?.result || [];
      setColumns(
        attrs.map((item: XAttribute) => {
          return {
            title: item.name,
            dataIndex: item.code,
            key: item.code,
            width:
              item.name.length <= 2
                ? 60
                : item.name.length > 12
                ? item.name.length * 12
                : item.name.length * 20,
          };
        }),
      );
    };
    loadAttrs();
  }, []);
  return (
    <EditableProTable
      headerTitle={item?.name}
      toolBarRender={() => [
        <Button key="select" type="primary" icon={<PlusOutlined />}>
          选择
        </Button>,
      ]}
      columns={columns}
      recordCreatorProps={false}
      scroll={{
        x: 1200,
      }}
      editable={{
        type: 'multiple',
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
    />
  );
};

const OperateItem = (props: any) => {
  const { item } = props;
  const { setNodeRef, listeners, transform } = useSortable({ id: item.id });
  const styles = {
    transform: CSS.Transform.toString(transform),
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
      case 'species':
        return <SpeciesTable item={item} />;
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
    <div ref={setNodeRef} {...listeners} style={styles}>
      {renderItem(item)}
    </div>
  );
};

export default OperateItem;
