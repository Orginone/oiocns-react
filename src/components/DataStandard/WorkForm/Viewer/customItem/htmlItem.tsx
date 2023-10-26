import React, { useState } from 'react';
import { TextArea } from 'devextreme-react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { ITextBoxOptions } from 'devextreme-react/text-box';
import { IDomEditor } from '@wangeditor/editor';

const HtmlEditItem: React.FC<ITextBoxOptions> = (props) => {
  const [isValid, setIsValid] = useState(props.isValid);
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const onChanged = React.useCallback((e: IDomEditor) => {
    const html = e.getHtml();
    setIsValid(e.getText().length > 0);
    if (html) {
      props.onValueChanged?.apply(this, [{ value: html } as any]);
    }
  }, []);

  return (
    <TextArea
      {...props}
      isValid={isValid}
      minHeight={350}
      width={'100%'}
      defaultValue=""
      value="">
      <div style={{ padding: 30, display: 'block', height: '100%', width: '100%' }}>
        {props.readOnly !== true && (
          <Toolbar
            editor={editor}
            mode="simple"
            defaultConfig={{
              excludeKeys: [
                'insertVideo',
                'uploadVideo',
                'uploadImage',
                'fullScreen',
                'insertImage',
                'insertImage',
                'deleteImage',
                'editImage',
                'viewImageLink',
                'imageWidth30',
                'imageWidth50',
                'imageWidth100',
              ],
            }}
          />
        )}
        <Editor
          mode="simple"
          defaultHtml={props.defaultValue}
          onCreated={setEditor}
          onChange={onChanged}
          defaultConfig={{
            placeholder: '在此输入内容',
            readOnly: props.readOnly,
          }}
          style={{ height: 220 }}
        />
      </div>
    </TextArea>
  );
};

export default HtmlEditItem;
