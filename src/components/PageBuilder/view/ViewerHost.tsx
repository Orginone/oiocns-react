import { useSimpleSignal } from '@/hooks/useSignal';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import React from 'react';
import { IPageContext, PageContext } from '../render/PageContext';
import HostManagerBase from '../render/HostManager';

export interface ViewerProps {
  current: IPageTemplate;
}

export function ViewerHost({ current }: ViewerProps) {
  const ctx = useSimpleSignal<IPageContext<'view'>>({
    view: new HostManagerBase('view', current),
  });

  const RootRender = ctx.current.view.components.rootRender as any;
  return (
    <PageContext.Provider value={ctx.current}>
      <div className="o-page-host page-host--view">
        <RootRender element={current.metadata.rootElement}></RootRender>
      </div>
    </PageContext.Provider>
  );
}
