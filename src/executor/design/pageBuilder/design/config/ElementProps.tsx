import { $confirm } from '@/utils/react/antd';
import { Empty, Tag, message } from 'antd';
import React, { useContext } from 'react';
import { TypeMeta } from '../../core/ElementMeta';
import { PageElement } from '../../core/PageElement';
import { DesignContext, PageContext } from '../../render/PageContext';
import ElementPropsItem from './ElementPropsItem';
import './index.less';

interface Props {
  element: PageElement | null;
}

export async function removeElement(element: PageElement | null, ctx: DesignContext) {
  if (!element) {
    return;
  }
  if (element.kind == 'Root') {
    message.error('根元素不可删除');
    return;
  }
  await $confirm({
    title: '提示',
    okText: '确定',
    cancelText: '取消',
    content: `确实要移除元素 ${element.name} 及其所有下级？`,
  });
  ctx.view.removeElement(element, true);
}

export default function ElementProps({ element }: Props) {
  const ctx = useContext<DesignContext>(PageContext as any);

  const commonTypeMeta: Dictionary<TypeMeta> = {
    id: {
      type: 'string',
      label: 'ID',
      readonly: true,
    },
    name: {
      type: 'string',
      label: '名称',
      required: true,
    },
    className: {
      type: 'string',
      label: 'CSS类名',
    },
    style: {
      type: 'string',
      label: 'CSS样式',
    },
  };

  if (!element) {
    return (
      <div>
        <Empty description={`请选择一个元素`} />
      </div>
    );
  }

  const meta = ctx.view.elements.elementMeta[element.kind] || {};

  return (
    <div className="page-element-props">
      <div className="props-header">
        {/* <span className="header-id">[{element.id}]</span> */}
        <span className="header-title">{element.name || '（未命名）'}</span>
        <Tag color="processing" className="header-kind">
          {meta.label || element.kind}
        </Tag>
        <div style={{ flex: 'auto' }}></div>
      </div>
      <div className="props-content">
        {Object.entries(commonTypeMeta).map(([prop, meta]) => {
          return (
            <ElementPropsItem
              key={'common_' + prop}
              target={element}
              prop={prop}
              meta={meta}
            />
          );
        })}
        <div className="diver"></div>
        {Object.entries(meta.props).map(([prop, meta]) => {
          return (
            <ElementPropsItem
              key={prop}
              target={element.props}
              prop={prop}
              meta={meta}
              onValueChange={() => {
                ctx.view.emitter('props', 'change', element.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
