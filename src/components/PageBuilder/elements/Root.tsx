
import React, { useContext } from "react";
import { defineElement } from "./defineElement";
import { PageContext } from "../render/PageContext";


export default defineElement({
  render(props) {
    const ctx = useContext(PageContext);
    return <div style={{ height: '100%' }}  className="root">
      {
        props.children.map(c => {
          // 自递归渲染
          const Render = ctx.view.components.getComponentRender(c.kind);
          return <Render key={c.id} element={c}/>;
        })
      }
      </div>
  },
  displayName: "Root",
  meta: {
    props: {

  },
    label: "模板根元素",
  }
})