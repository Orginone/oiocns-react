import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import CustomTree from '@/components/CustomTree';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { PageElement } from '../core/PageElement';
import { DesignContext } from '../render/PageContext';
import AddElementModal from './AddElementModal';
import { removeElement } from './config/ElementProps';
import cls from './tree.module.less';
import { ElementType, ElementTypeName } from '../core/ElementMeta';

interface IProps {
  ctx: DesignContext;
}

const buildElementTree = (
  element: PageElement,
  ctx: DesignContext,
  parent?: PageElement,
  typeName?: ElementType,
  prop?: string,
  children: PageElement[] = [],
): any => {
  const meta = ctx.view.treeManager.factory.getMeta(element.kind);
  const slots: { ele: PageElement; prop: string; single: boolean }[] = [];
  if (meta && meta.slots) {
    for (const key of Object.keys(meta.slots)) {
      let slot = meta.slots[key];
      let ele = element.slots?.[key];
      if (slot.single) {
        if (!ele) {
          ele = ctx.view.treeManager.factory.create('Any', slot.label ?? '插槽');
          ele.props.seize = true;
        }
        slots.push({ ele: ele as PageElement, prop: key, single: true });
      } else {
        ele = ctx.view.treeManager.factory.create('Any', slot.label ?? '数组插槽');
        ele.props.seize = true;
        slots.push({ ele: ele, prop: key, single: false });
      }
    }
  }
  return {
    key: element.id,
    title: element.name,
    item: element,
    isLeaf: element.children.length === 0 && slots.length == 0 && children.length == 0,
    typeName: typeName ?? meta?.type,
    icon: <EntityIcon entityId={element.id} size={18} />,
    parent: parent,
    prop: prop,
    children: [
      ...children,
      ...element.children.map((item) => buildElementTree(item, ctx, element)),
      ...slots.map((item) => {
        if (item.single) {
          return buildElementTree(item.ele, ctx, element, 'Slot', item.prop);
        } else {
          return buildElementTree(
            item.ele,
            ctx,
            element,
            'ArraySlot',
            item.prop,
            element.slots?.[item.prop] as PageElement[],
          );
        }
      }),
    ],
  };
};

const TreeManager: React.FC<IProps> = ({ ctx }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const tree = [buildElementTree(ctx.view.rootElement, ctx)];
  const prop = useRef();
  return (
    <div style={{ margin: '0 8px' }}>
      <CustomTree
        treeData={tree}
        defaultExpandAll={true}
        searchable
        draggable
        onSelect={(_, info) => {
          const node = info.node as any;
          if (['ArraySlot', 'Slot'].includes(node.typeName) && node.item.props.seize) {
            ctx.view.currentElement = node.parent;
            prop.current = node.prop;
            setVisible(true);
            return;
          }
          ctx.view.currentElement = node.item;
          prop.current = undefined;
        }}
        selectedKeys={[ctx.view.currentElement?.id ?? '']}
        titleRender={(node: any) => {
          return (
            <div className={cls.node}>
              <Space size={0}>
                <Tag>{node.item.name}</Tag>
                <Tag>{node.item.kind}</Tag>
                <Tag>{ElementTypeName[node.typeName as ElementType]}</Tag>
                {node.item.props.seize && <Tag color="red">未放置</Tag>}
              </Space>
              <Space>
                {['ArraySlot', 'Container'].includes(node.typeName) && (
                  <Button
                    shape="circle"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setVisible(true)}
                  />
                )}
                {ctx.view.rootElement != node.item && !node.item.props.seize && (
                  <Button
                    shape="circle"
                    size="small"
                    danger
                    icon={<MinusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(node.item, ctx);
                    }}
                  />
                )}
              </Space>
            </div>
          );
        }}
        onDrop={(info) => {
          const dragItem = (info.dragNode as any).item;
          const dropNode = info.node as any;
          if (dragItem.parentId == dropNode.item.id) {
            const positions = dropNode.pos.split('-');
            ctx.view.moveElement(
              dragItem,
              dropNode.item.id,
              positions[positions.length - 1],
            );
          } else {
            ctx.view.changeElement(dragItem, dropNode.item.id);
          }
        }}
      />
      <AddElementModal
        visible={visible}
        parentId={ctx.view.currentElement?.id!}
        onVisibleChange={(v) => setVisible(v)}
        prop={prop.current}
      />
    </div>
  );
};

export default TreeManager;
