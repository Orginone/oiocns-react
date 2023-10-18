import React from 'react';
import { IPageContext, PageContext } from '../render/PageContext';

export interface ViewerProps {
  ctx: IPageContext<'view'>;
}

export function ViewerHost({ ctx }: ViewerProps) {
  const RootRender = ctx.view.components.rootRender as any;
  return (
    <PageContext.Provider value={ctx}>
      <div className="o-page-host page-host--view">
        <RootRender element={ctx.view.rootElement}></RootRender>
      </div>
    </PageContext.Provider>
  );
}
