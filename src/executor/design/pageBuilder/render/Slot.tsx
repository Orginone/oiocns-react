import React, { useContext } from 'react';
import { PageContext } from './PageContext';
import { PageElement } from '../core/PageElement';

type SlotProps<S extends Dictionary<any> = Dictionary<any>> = {
  params?: S;
  child: PageElement;
};

export function Slot({ child, params }: SlotProps) {
  const ctx = useContext(PageContext);
  const Render = ctx.view.components.getComponentRender(child.kind, ctx.view.mode);
  return <Render element={child} slotParams={params} />;
}
