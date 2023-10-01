import { createContext } from "react";
import { HostMode } from "../core/IViewHost";
import type HostManagerBase from "./HostManager";
import DesignerManager from "../design/DesignerManager";


export const PageContext = createContext<IPageContext<HostMode>>({
  view: null!
});

export interface IPageContext<T extends HostMode> {
  view: HostManagerBase<T>;
}

export interface DesignContext extends IPageContext<'design'>{
  view: DesignerManager;
}

export interface ViewContext extends IPageContext<'view'>{
  view: HostManagerBase<'view'>;
}