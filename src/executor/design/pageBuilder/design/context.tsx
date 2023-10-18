import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import React, { useContext, useState } from 'react';
import { DesignContext, PageContext } from '../render/PageContext';

const stringify = (ctx: DesignContext) => {
  return JSON.stringify(ctx.view.rootChildren, null, 2);
};

const Coder: React.FC<{}> = () => {
  const ctx = useContext<DesignContext>(PageContext as any);
  const [data, setData] = useState<string>(stringify(ctx));
  ctx.view.subscribe(() => setData(stringify(ctx)));
  return (
    <CodeMirror
      style={{ marginTop: 10 }}
      value={data}
      editable={false}
      extensions={[json()]}
      onChange={setData}
    />
  );
};

export default Coder;
