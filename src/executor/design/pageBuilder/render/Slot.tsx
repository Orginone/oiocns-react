import React, { useContext } from 'react';
import { PageElement } from '../core/PageElement';
import { PageContext } from './PageContext';

type SlotProps<S extends Dictionary<any> = Dictionary<any>> = {
  params?: S;
  child: PageElement;
};

export function Slot({ child, params }: SlotProps) {
  const ctx = useContext(PageContext);
  const Render = ctx.view.components.getComponentRender(child.kind, ctx.view.mode);
  return <Render element={child} slotParams={params} />;
}
